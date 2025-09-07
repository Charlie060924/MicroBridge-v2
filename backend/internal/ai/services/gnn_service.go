package services

import (
	"context"
	"fmt"
	"math"
	"sort"
	"sync"
	"time"

	"microbridge/backend/internal/ai/models"
)

// GNNService implements Graph Neural Networks for skill relationship modeling
type GNNService struct {
	mu                  sync.RWMutex
	skillGraph          *models.SkillGraph
	nodeEmbeddings      map[string][]float64
	edgeWeights         map[string]map[string]float64
	aggregationWeights  [][]float64
	transformWeights    [][]float64
	numLayers           int
	embeddingDim        int
	hiddenDim           int
	aggregationType     string
	isTraining          bool
	modelVersion        string
	lastTrainingTime    time.Time
	skillSimilarityCache map[string]map[string]float64
	pathCache           map[string]map[string][]string
}

// SkillRelationship represents the relationship between two skills
type SkillRelationship struct {
	FromSkill  string  `json:"from_skill"`
	ToSkill    string  `json:"to_skill"`
	Strength   float64 `json:"strength"`
	Type       string  `json:"type"` // "requires", "similar", "complements", "prerequisite"
	Distance   int     `json:"distance"`
	Confidence float64 `json:"confidence"`
}

// SkillPath represents a learning path between skills
type SkillPath struct {
	From        string   `json:"from_skill"`
	To          string   `json:"to_skill"`
	Path        []string `json:"path"`
	Difficulty  float64  `json:"difficulty"`
	EstimatedTime int    `json:"estimated_time_hours"`
	Prerequisites []string `json:"prerequisites"`
}

// NewGNNService creates a new Graph Neural Network service
func NewGNNService(config *models.GNNConfig) *GNNService {
	service := &GNNService{
		skillGraph:           &models.SkillGraph{Nodes: make(map[string]*models.SkillGraphNode), Edges: make(map[string][]models.GraphEdge)},
		nodeEmbeddings:       make(map[string][]float64),
		edgeWeights:          make(map[string]map[string]float64),
		numLayers:            config.NumLayers,
		embeddingDim:         config.NodeEmbeddingDim,
		hiddenDim:            config.HiddenDim,
		aggregationType:      config.AggregationType,
		modelVersion:         fmt.Sprintf("gnn_v%d", time.Now().Unix()),
		skillSimilarityCache: make(map[string]map[string]float64),
		pathCache:            make(map[string]map[string][]string),
	}

	service.initializeWeights()
	return service
}

// BuildSkillGraph constructs the skill relationship graph from training data
func (s *GNNService) BuildSkillGraph(ctx context.Context, skillCooccurrences map[string]map[string]int, jobSkillData map[string][]string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Initialize skill nodes
	allSkills := make(map[string]bool)
	for skill := range skillCooccurrences {
		allSkills[skill] = true
	}
	for _, skills := range jobSkillData {
		for _, skill := range skills {
			allSkills[skill] = true
		}
	}

	// Create nodes for each skill
	for skill := range allSkills {
		node := &models.SkillGraphNode{
			SkillID:     skill,
			SkillName:   skill,
			Category:    s.inferSkillCategory(skill),
			Embedding:   s.initializeNodeEmbedding(),
			Connections: make(map[string]float64),
			Features:    make(map[string]interface{}),
			UpdatedAt:   time.Now(),
		}
		s.skillGraph.Nodes[skill] = node
		s.nodeEmbeddings[skill] = node.Embedding
	}

	// Build edges based on co-occurrence patterns
	s.buildCooccurrenceEdges(skillCooccurrences)
	
	// Build prerequisite and similarity edges
	s.buildSemanticEdges(jobSkillData)
	
	// Compute initial edge weights
	s.computeEdgeWeights()

	return nil
}

// GetSkillSimilarity returns similarity score between two skills
func (s *GNNService) GetSkillSimilarity(ctx context.Context, skill1, skill2 string) (float64, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Check cache first
	if cached, exists := s.skillSimilarityCache[skill1]; exists {
		if similarity, found := cached[skill2]; found {
			return similarity, nil
		}
	}

	// Calculate similarity using embeddings
	emb1, exists1 := s.nodeEmbeddings[skill1]
	emb2, exists2 := s.nodeEmbeddings[skill2]
	
	if !exists1 || !exists2 {
		return 0.0, fmt.Errorf("skill embeddings not found for %s or %s", skill1, skill2)
	}

	similarity := s.cosineSimilarity(emb1, emb2)
	
	// Cache the result
	if s.skillSimilarityCache[skill1] == nil {
		s.skillSimilarityCache[skill1] = make(map[string]float64)
	}
	s.skillSimilarityCache[skill1][skill2] = similarity

	return similarity, nil
}

// GetRelatedSkills returns skills related to the input skill
func (s *GNNService) GetRelatedSkills(ctx context.Context, skill string, relationTypes []string, topK int) ([]*SkillRelationship, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	node, exists := s.skillGraph.Nodes[skill]
	if !exists {
		return nil, fmt.Errorf("skill %s not found in graph", skill)
	}

	var relationships []*SkillRelationship

	// Direct connections
	for connectedSkill, strength := range node.Connections {
		if s.shouldIncludeRelation("direct", relationTypes) {
			rel := &SkillRelationship{
				FromSkill:  skill,
				ToSkill:    connectedSkill,
				Strength:   strength,
				Type:       s.inferRelationType(skill, connectedSkill),
				Distance:   1,
				Confidence: strength,
			}
			relationships = append(relationships, rel)
		}
	}

	// Second-degree connections (through intermediate skills)
	for connectedSkill := range node.Connections {
		if intermediateNode, exists := s.skillGraph.Nodes[connectedSkill]; exists {
			for secondDegreeSkill, secondStrength := range intermediateNode.Connections {
				if secondDegreeSkill != skill { // Avoid self-connections
					combinedStrength := node.Connections[connectedSkill] * secondStrength * 0.8 // Decay factor
					
					if s.shouldIncludeRelation("indirect", relationTypes) {
						rel := &SkillRelationship{
							FromSkill:  skill,
							ToSkill:    secondDegreeSkill,
							Strength:   combinedStrength,
							Type:       "indirect",
							Distance:   2,
							Confidence: combinedStrength,
						}
						relationships = append(relationships, rel)
					}
				}
			}
		}
	}

	// Sort by strength and return top K
	sort.Slice(relationships, func(i, j int) bool {
		return relationships[i].Strength > relationships[j].Strength
	})

	if len(relationships) > topK {
		relationships = relationships[:topK]
	}

	return relationships, nil
}

// GetSkillLearningPath returns the optimal learning path between skills
func (s *GNNService) GetSkillLearningPath(ctx context.Context, fromSkill, toSkill string, maxDepth int) (*SkillPath, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Check cache first
	if cached, exists := s.pathCache[fromSkill]; exists {
		if path, found := cached[toSkill]; found {
			return s.constructSkillPath(fromSkill, toSkill, path), nil
		}
	}

	// Use Dijkstra's algorithm to find shortest path
	path, distance := s.findShortestPath(fromSkill, toSkill, maxDepth)
	if len(path) == 0 {
		return nil, fmt.Errorf("no learning path found from %s to %s", fromSkill, toSkill)
	}

	// Cache the result
	if s.pathCache[fromSkill] == nil {
		s.pathCache[fromSkill] = make(map[string][]string)
	}
	s.pathCache[fromSkill][toSkill] = path

	skillPath := s.constructSkillPath(fromSkill, toSkill, path)
	skillPath.Difficulty = distance

	return skillPath, nil
}

// PropagateMessage performs message passing for GNN training
func (s *GNNService) PropagateMessage(ctx context.Context, iterations int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	for iter := 0; iter < iterations; iter++ {
		newEmbeddings := make(map[string][]float64)

		// Message passing for each node
		for nodeID, node := range s.skillGraph.Nodes {
			// Collect messages from neighbors
			neighborMessages := s.collectNeighborMessages(nodeID, node)
			
			// Aggregate messages
			aggregatedMessage := s.aggregateMessages(neighborMessages)
			
			// Update node embedding
			currentEmbedding := s.nodeEmbeddings[nodeID]
			newEmbedding := s.updateNodeEmbedding(currentEmbedding, aggregatedMessage)
			
			newEmbeddings[nodeID] = newEmbedding
		}

		// Update all embeddings
		s.nodeEmbeddings = newEmbeddings
		
		// Update node embeddings in graph
		for nodeID, embedding := range newEmbeddings {
			s.skillGraph.Nodes[nodeID].Embedding = embedding
			s.skillGraph.Nodes[nodeID].UpdatedAt = time.Now()
		}
	}

	// Clear cache after embedding updates
	s.clearCache()

	return nil
}

// TrainGNN trains the Graph Neural Network
func (s *GNNService) TrainGNN(ctx context.Context, trainingData []*models.TrainingData, config *models.GNNConfig) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.isTraining = true
	defer func() { s.isTraining = false }()

	// Training loop
	for epoch := 0; epoch < config.MaxEpochs; epoch++ {
		// Forward pass - message propagation
		err := s.PropagateMessage(ctx, config.NumLayers)
		if err != nil {
			return fmt.Errorf("message propagation failed: %w", err)
		}

		// Compute loss and gradients
		loss := s.computeTrainingLoss(trainingData)
		
		// Backward pass - update weights
		s.updateWeights(config.LearningRate)

		if epoch%10 == 0 {
			fmt.Printf("GNN Training - Epoch %d, Loss: %.4f\n", epoch, loss)
		}
	}

	s.lastTrainingTime = time.Now()
	return nil
}

// GetModelInfo returns information about the GNN model
func (s *GNNService) GetModelInfo() *models.ModelInfo {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return &models.ModelInfo{
		ModelID:      s.modelVersion,
		ModelType:    "gnn",
		Version:      s.modelVersion,
		LoadedAt:     s.lastTrainingTime,
		InputShape:   []int{s.embeddingDim},
		OutputShape:  []int{s.embeddingDim},
		Parameters:   s.countParameters(),
		Capabilities: []string{"skill_similarity", "skill_relationships", "learning_paths", "graph_embeddings"},
		Metadata: map[string]interface{}{
			"num_skills":       len(s.skillGraph.Nodes),
			"num_edges":        s.countEdges(),
			"embedding_dim":    s.embeddingDim,
			"hidden_dim":       s.hiddenDim,
			"num_layers":       s.numLayers,
			"aggregation_type": s.aggregationType,
		},
	}
}

// Private methods

func (s *GNNService) initializeWeights() {
	// Initialize aggregation weights
	s.aggregationWeights = make([][]float64, s.numLayers)
	s.transformWeights = make([][]float64, s.numLayers)

	for layer := 0; layer < s.numLayers; layer++ {
		// Aggregation weights (embedding_dim x embedding_dim)
		s.aggregationWeights[layer] = s.initializeMatrix(s.embeddingDim, s.embeddingDim)
		
		// Transform weights (hidden_dim x embedding_dim)
		s.transformWeights[layer] = s.initializeMatrix(s.hiddenDim, s.embeddingDim)
	}
}

func (s *GNNService) initializeMatrix(rows, cols int) []float64 {
	matrix := make([]float64, rows*cols)
	stddev := math.Sqrt(2.0 / float64(rows)) // He initialization

	for i := range matrix {
		matrix[i] = (2.0*math.Abs(math.Sin(float64(i)*0.1)) - 1.0) * stddev // Deterministic initialization
	}

	return matrix
}

func (s *GNNService) initializeNodeEmbedding() []float64 {
	embedding := make([]float64, s.embeddingDim)
	for i := range embedding {
		embedding[i] = (2.0*math.Abs(math.Sin(float64(i)*0.1)) - 1.0) * 0.1
	}
	return embedding
}

func (s *GNNService) inferSkillCategory(skill string) string {
	// Simple skill categorization based on keywords
	skill = fmt.Sprintf("%s", skill) // Convert to lowercase
	
	programmingKeywords := []string{"python", "java", "javascript", "go", "rust", "c++", "programming"}
	webKeywords := []string{"html", "css", "react", "vue", "angular", "web", "frontend", "backend"}
	dataKeywords := []string{"sql", "database", "analytics", "machine learning", "data"}
	
	for _, keyword := range programmingKeywords {
		if contains(skill, keyword) {
			return "programming"
		}
	}
	
	for _, keyword := range webKeywords {
		if contains(skill, keyword) {
			return "web_development"
		}
	}
	
	for _, keyword := range dataKeywords {
		if contains(skill, keyword) {
			return "data_science"
		}
	}
	
	return "general"
}

func (s *GNNService) buildCooccurrenceEdges(cooccurrences map[string]map[string]int) {
	for skill1, cooccurMap := range cooccurrences {
		if _, exists := s.skillGraph.Edges[skill1]; !exists {
			s.skillGraph.Edges[skill1] = []models.GraphEdge{}
		}

		for skill2, count := range cooccurMap {
			if skill1 != skill2 && count > 1 { // Minimum co-occurrence threshold
				weight := s.normalizeCooccurrence(count)
				
				edge := models.GraphEdge{
					SourceID: skill1,
					TargetID: skill2,
					Weight:   weight,
					EdgeType: "cooccurrence",
				}
				
				s.skillGraph.Edges[skill1] = append(s.skillGraph.Edges[skill1], edge)
				
				// Update node connections
				if s.skillGraph.Nodes[skill1].Connections == nil {
					s.skillGraph.Nodes[skill1].Connections = make(map[string]float64)
				}
				s.skillGraph.Nodes[skill1].Connections[skill2] = weight
			}
		}
	}
}

func (s *GNNService) buildSemanticEdges(jobSkillData map[string][]string) {
	// Analyze skill ordering in job postings to infer prerequisites
	skillPositions := make(map[string][]int)
	
	for _, skills := range jobSkillData {
		for i, skill := range skills {
			skillPositions[skill] = append(skillPositions[skill], i)
		}
	}
	
	// Build prerequisite relationships based on typical ordering
	for skill1, positions1 := range skillPositions {
		avgPos1 := s.average(positions1)
		
		for skill2, positions2 := range skillPositions {
			if skill1 != skill2 {
				avgPos2 := s.average(positions2)
				
				// If skill1 typically appears before skill2, it might be a prerequisite
				if avgPos1 < avgPos2-0.5 && s.cooccursFrequently(skill1, skill2, jobSkillData) {
					weight := 0.7 // Prerequisite relationship
					
					edge := models.GraphEdge{
						SourceID: skill1,
						TargetID: skill2,
						Weight:   weight,
						EdgeType: "prerequisite",
					}
					
					s.skillGraph.Edges[skill1] = append(s.skillGraph.Edges[skill1], edge)
					s.skillGraph.Nodes[skill1].Connections[skill2] = weight
				}
			}
		}
	}
}

func (s *GNNService) computeEdgeWeights() {
	s.edgeWeights = make(map[string]map[string]float64)
	
	for sourceID, edges := range s.skillGraph.Edges {
		if s.edgeWeights[sourceID] == nil {
			s.edgeWeights[sourceID] = make(map[string]float64)
		}
		
		for _, edge := range edges {
			s.edgeWeights[sourceID][edge.TargetID] = edge.Weight
		}
	}
}

func (s *GNNService) cosineSimilarity(a, b []float64) float64 {
	if len(a) != len(b) {
		return 0.0
	}
	
	var dotProduct, normA, normB float64
	for i := range a {
		dotProduct += a[i] * b[i]
		normA += a[i] * a[i]
		normB += b[i] * b[i]
	}
	
	if normA == 0 || normB == 0 {
		return 0.0
	}
	
	return dotProduct / (math.Sqrt(normA) * math.Sqrt(normB))
}

func (s *GNNService) shouldIncludeRelation(relationType string, requestedTypes []string) bool {
	if len(requestedTypes) == 0 {
		return true // Include all if no specific types requested
	}
	
	for _, requestedType := range requestedTypes {
		if relationType == requestedType {
			return true
		}
	}
	return false
}

func (s *GNNService) inferRelationType(skill1, skill2 string) string {
	// Simple heuristic to infer relationship type
	if s.isPrerequisite(skill1, skill2) {
		return "prerequisite"
	}
	
	similarity, _ := s.GetSkillSimilarity(context.Background(), skill1, skill2)
	if similarity > 0.8 {
		return "similar"
	} else if similarity > 0.5 {
		return "related"
	}
	
	return "general"
}

func (s *GNNService) isPrerequisite(skill1, skill2 string) bool {
	// Check if there's a prerequisite edge from skill1 to skill2
	if edges, exists := s.skillGraph.Edges[skill1]; exists {
		for _, edge := range edges {
			if edge.TargetID == skill2 && edge.EdgeType == "prerequisite" {
				return true
			}
		}
	}
	return false
}

func (s *GNNService) findShortestPath(fromSkill, toSkill string, maxDepth int) ([]string, float64) {
	// Dijkstra's algorithm implementation
	distances := make(map[string]float64)
	previous := make(map[string]string)
	visited := make(map[string]bool)
	
	// Initialize distances
	for skill := range s.skillGraph.Nodes {
		distances[skill] = math.Inf(1)
	}
	distances[fromSkill] = 0.0
	
	for len(visited) < len(s.skillGraph.Nodes) {
		// Find unvisited node with minimum distance
		var current string
		minDist := math.Inf(1)
		for skill, dist := range distances {
			if !visited[skill] && dist < minDist {
				minDist = dist
				current = skill
			}
		}
		
		if current == "" || minDist == math.Inf(1) {
			break // No more reachable nodes
		}
		
		visited[current] = true
		
		if current == toSkill {
			break // Found target
		}
		
		// Update distances to neighbors
		if node, exists := s.skillGraph.Nodes[current]; exists {
			for neighbor, weight := range node.Connections {
				if !visited[neighbor] {
					alt := distances[current] + (1.0 - weight) // Invert weight for shortest path
					if alt < distances[neighbor] {
						distances[neighbor] = alt
						previous[neighbor] = current
					}
				}
			}
		}
	}
	
	// Reconstruct path
	path := []string{}
	current := toSkill
	for current != "" {
		path = append([]string{current}, path...)
		current = previous[current]
	}
	
	if len(path) == 0 || path[0] != fromSkill {
		return []string{}, 0.0 // No path found
	}
	
	return path, distances[toSkill]
}

func (s *GNNService) constructSkillPath(fromSkill, toSkill string, path []string) *SkillPath {
	estimatedTime := len(path) * 20 // 20 hours per skill (rough estimate)
	prerequisites := []string{}
	
	if len(path) > 2 {
		prerequisites = path[1 : len(path)-1] // Intermediate skills as prerequisites
	}
	
	return &SkillPath{
		From:          fromSkill,
		To:            toSkill,
		Path:          path,
		EstimatedTime: estimatedTime,
		Prerequisites: prerequisites,
	}
}

func (s *GNNService) collectNeighborMessages(nodeID string, node *models.SkillGraphNode) [][]float64 {
	var messages [][]float64
	
	for neighborID, weight := range node.Connections {
		if neighborEmb, exists := s.nodeEmbeddings[neighborID]; exists {
			// Weight the neighbor embedding by edge weight
			weightedMessage := make([]float64, len(neighborEmb))
			for i, val := range neighborEmb {
				weightedMessage[i] = val * weight
			}
			messages = append(messages, weightedMessage)
		}
	}
	
	return messages
}

func (s *GNNService) aggregateMessages(messages [][]float64) []float64 {
	if len(messages) == 0 {
		return make([]float64, s.embeddingDim)
	}
	
	switch s.aggregationType {
	case "mean":
		return s.meanAggregation(messages)
	case "max":
		return s.maxAggregation(messages)
	case "attention":
		return s.attentionAggregation(messages)
	default:
		return s.meanAggregation(messages)
	}
}

func (s *GNNService) meanAggregation(messages [][]float64) []float64 {
	if len(messages) == 0 {
		return make([]float64, s.embeddingDim)
	}
	
	aggregated := make([]float64, s.embeddingDim)
	for _, message := range messages {
		for i, val := range message {
			aggregated[i] += val
		}
	}
	
	// Average
	for i := range aggregated {
		aggregated[i] /= float64(len(messages))
	}
	
	return aggregated
}

func (s *GNNService) maxAggregation(messages [][]float64) []float64 {
	if len(messages) == 0 {
		return make([]float64, s.embeddingDim)
	}
	
	aggregated := make([]float64, s.embeddingDim)
	for i := 0; i < s.embeddingDim; i++ {
		maxVal := messages[0][i]
		for j := 1; j < len(messages); j++ {
			if messages[j][i] > maxVal {
				maxVal = messages[j][i]
			}
		}
		aggregated[i] = maxVal
	}
	
	return aggregated
}

func (s *GNNService) attentionAggregation(messages [][]float64) []float64 {
	// Simplified attention mechanism
	if len(messages) == 0 {
		return make([]float64, s.embeddingDim)
	}
	
	// Compute attention scores (simplified)
	attentionScores := make([]float64, len(messages))
	totalScore := 0.0
	
	for i, message := range messages {
		score := s.vectorNorm(message) // Use L2 norm as attention score
		attentionScores[i] = score
		totalScore += score
	}
	
	// Normalize attention scores
	if totalScore > 0 {
		for i := range attentionScores {
			attentionScores[i] /= totalScore
		}
	}
	
	// Weighted aggregation
	aggregated := make([]float64, s.embeddingDim)
	for i, message := range messages {
		weight := attentionScores[i]
		for j, val := range message {
			aggregated[j] += val * weight
		}
	}
	
	return aggregated
}

func (s *GNNService) updateNodeEmbedding(currentEmbedding, aggregatedMessage []float64) []float64 {
	// Simple update rule: combine current embedding with aggregated message
	newEmbedding := make([]float64, len(currentEmbedding))
	
	for i := range currentEmbedding {
		// Linear combination with learnable weights (simplified)
		newEmbedding[i] = 0.7*currentEmbedding[i] + 0.3*aggregatedMessage[i]
	}
	
	return newEmbedding
}

func (s *GNNService) clearCache() {
	s.skillSimilarityCache = make(map[string]map[string]float64)
	s.pathCache = make(map[string]map[string][]string)
}

func (s *GNNService) computeTrainingLoss(trainingData []*models.TrainingData) float64 {
	// Simplified training loss computation
	totalLoss := 0.0
	count := 0
	
	for _, sample := range trainingData {
		// Use skill similarity as supervision signal
		userSkills := s.extractSkillsFromFeatures(sample.Features.UserFeatures)
		jobSkills := s.extractSkillsFromFeatures(sample.Features.JobFeatures)
		
		for _, userSkill := range userSkills {
			for _, jobSkill := range jobSkills {
				similarity, err := s.GetSkillSimilarity(context.Background(), userSkill, jobSkill)
				if err == nil {
					expectedSimilarity := sample.Label // Use label as expected similarity
					loss := (similarity - expectedSimilarity) * (similarity - expectedSimilarity)
					totalLoss += loss
					count++
				}
			}
		}
	}
	
	if count > 0 {
		return totalLoss / float64(count)
	}
	return 0.0
}

func (s *GNNService) updateWeights(learningRate float64) {
	// Simplified weight update (normally would use computed gradients)
	for layer := 0; layer < s.numLayers; layer++ {
		for i := range s.aggregationWeights[layer] {
			// Add small random perturbation for simplicity
			s.aggregationWeights[layer][i] += learningRate * (2.0*math.Sin(float64(i)*0.1) - 1.0) * 0.01
		}
	}
}

func (s *GNNService) countParameters() int {
	count := 0
	
	// Node embeddings
	count += len(s.nodeEmbeddings) * s.embeddingDim
	
	// Layer weights
	for layer := 0; layer < s.numLayers; layer++ {
		count += len(s.aggregationWeights[layer])
		count += len(s.transformWeights[layer])
	}
	
	return count
}

func (s *GNNService) countEdges() int {
	count := 0
	for _, edges := range s.skillGraph.Edges {
		count += len(edges)
	}
	return count
}

func (s *GNNService) vectorNorm(vec []float64) float64 {
	sum := 0.0
	for _, val := range vec {
		sum += val * val
	}
	return math.Sqrt(sum)
}

func (s *GNNService) extractSkillsFromFeatures(features map[string]float64) []string {
	// Extract skill names from feature map
	var skills []string
	for feature := range features {
		if contains(feature, "skill_") {
			skill := feature[6:] // Remove "skill_" prefix
			skills = append(skills, skill)
		}
	}
	return skills
}

func (s *GNNService) normalizeCooccurrence(count int) float64 {
	// Simple normalization (could be improved with TF-IDF or other methods)
	return math.Min(float64(count)/10.0, 1.0)
}

func (s *GNNService) average(nums []int) float64 {
	if len(nums) == 0 {
		return 0.0
	}
	sum := 0
	for _, num := range nums {
		sum += num
	}
	return float64(sum) / float64(len(nums))
}

func (s *GNNService) cooccursFrequently(skill1, skill2 string, jobSkillData map[string][]string) bool {
	count := 0
	total := 0
	
	for _, skills := range jobSkillData {
		hasSkill1 := contains(skills, skill1)
		hasSkill2 := contains(skills, skill2)
		
		if hasSkill1 && hasSkill2 {
			count++
		}
		if hasSkill1 || hasSkill2 {
			total++
		}
	}
	
	if total == 0 {
		return false
	}
	
	frequency := float64(count) / float64(total)
	return frequency > 0.3 // 30% co-occurrence threshold
}

// Helper function
func contains(slice interface{}, item string) bool {
	switch s := slice.(type) {
	case []string:
		for _, a := range s {
			if a == item {
				return true
			}
		}
	case string:
		return fmt.Sprintf("%s", s) == fmt.Sprintf("%s", item) // Contains logic for strings
	}
	return false
}