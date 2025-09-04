import { useState, useEffect, useCallback } from 'react';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMilestoneRequest {
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface UpdateMilestoneRequest {
  id: string;
  title?: string;
  description?: string;
  dueDate?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'overdue';
}

export interface MilestoneStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionPercentage: number;
}

export const useMilestones = (projectId?: string) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MilestoneStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionPercentage: 0
  });

  // Calculate stats from milestones
  const calculateStats = useCallback((milestoneList: Milestone[]): MilestoneStats => {
    const total = milestoneList.length;
    const completed = milestoneList.filter(m => m.status === 'completed').length;
    const pending = milestoneList.filter(m => m.status === 'pending').length;
    const overdue = milestoneList.filter(m => m.status === 'overdue').length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      completionPercentage
    };
  }, []);

  // Fetch milestones for a project
  const fetchMilestones = useCallback(async (projectId: string) => {
    console.log('🎯 Fetching milestones for project:', projectId);
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await milestoneService.getMilestones(projectId);
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockMilestones: Milestone[] = [
        {
          id: '1',
          projectId,
          title: 'Project Setup',
          description: 'Initialize project repository and basic structure',
          dueDate: '2024-01-15',
          completedDate: '2024-01-14',
          status: 'completed',
          order: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z'
        },
        {
          id: '2',
          projectId,
          title: 'Design Phase',
          description: 'Create wireframes and design mockups',
          dueDate: '2024-01-25',
          status: 'in_progress',
          order: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z'
        },
        {
          id: '3',
          projectId,
          title: 'Development',
          description: 'Implement core functionality',
          dueDate: '2024-02-10',
          status: 'pending',
          order: 3,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          projectId,
          title: 'Testing & QA',
          description: 'Comprehensive testing and bug fixes',
          dueDate: '2024-02-20',
          status: 'pending',
          order: 4,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];

      setMilestones(mockMilestones);
      setStats(calculateStats(mockMilestones));
      console.log('🎯 Milestones loaded:', mockMilestones.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch milestones';
      console.error('🎯 Error fetching milestones:', err);
      setError(errorMessage);
      setMilestones([]);
      setStats(calculateStats([]));
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  // Create a new milestone
  const createMilestone = useCallback(async (milestoneData: CreateMilestoneRequest) => {
    console.log('🎯 Creating milestone:', milestoneData);
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await milestoneService.createMilestone(milestoneData);
      
      // Mock creation
      await new Promise(resolve => setTimeout(resolve, 300));
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        ...milestoneData,
        status: 'pending',
        order: milestones.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedMilestones = [...milestones, newMilestone];
      setMilestones(updatedMilestones);
      setStats(calculateStats(updatedMilestones));
      console.log('🎯 Milestone created:', newMilestone.id);
      return newMilestone;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create milestone';
      console.error('🎯 Error creating milestone:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [milestones, calculateStats]);

  // Update a milestone
  const updateMilestone = useCallback(async (milestoneId: string, updates: UpdateMilestoneRequest) => {
    console.log('🎯 Updating milestone:', milestoneId, updates);
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await milestoneService.updateMilestone(milestoneId, updates);
      
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedMilestones = milestones.map(milestone => 
        milestone.id === milestoneId 
          ? { 
              ...milestone, 
              ...updates, 
              updatedAt: new Date().toISOString(),
              completedDate: updates.status === 'completed' ? new Date().toISOString() : milestone.completedDate
            }
          : milestone
      );

      setMilestones(updatedMilestones);
      setStats(calculateStats(updatedMilestones));
      console.log('🎯 Milestone updated:', milestoneId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update milestone';
      console.error('🎯 Error updating milestone:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [milestones, calculateStats]);

  // Delete a milestone
  const deleteMilestone = useCallback(async (milestoneId: string) => {
    console.log('🎯 Deleting milestone:', milestoneId);
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // await milestoneService.deleteMilestone(milestoneId);
      
      // Mock deletion
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedMilestones = milestones.filter(m => m.id !== milestoneId);
      setMilestones(updatedMilestones);
      setStats(calculateStats(updatedMilestones));
      console.log('🎯 Milestone deleted:', milestoneId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete milestone';
      console.error('🎯 Error deleting milestone:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [milestones, calculateStats]);

  // Mark milestone as completed
  const completeMilestone = useCallback(async (milestoneId: string) => {
    console.log('🎯 Completing milestone:', milestoneId);
    return updateMilestone(milestoneId, { status: 'completed' });
  }, [updateMilestone]);

  // Reorder milestones
  const reorderMilestones = useCallback(async (milestoneIds: string[]) => {
    console.log('🎯 Reordering milestones:', milestoneIds);
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // await milestoneService.reorderMilestones(milestoneIds);
      
      // Mock reordering
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedMilestones = milestoneIds.map((id, index) => {
        const milestone = milestones.find(m => m.id === id);
        return milestone ? { ...milestone, order: index + 1, updatedAt: new Date().toISOString() } : null;
      }).filter(Boolean) as Milestone[];

      setMilestones(updatedMilestones);
      console.log('🎯 Milestones reordered');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder milestones';
      console.error('🎯 Error reordering milestones:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [milestones]);

  // Load milestones when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchMilestones(projectId);
    } else {
      setMilestones([]);
      setStats(calculateStats([]));
    }
  }, [projectId, fetchMilestones, calculateStats]);

  return {
    // State
    milestones,
    loading,
    error,
    stats,
    
    // Actions
    fetchMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    completeMilestone,
    reorderMilestones,
    
    // Utilities
    hasMilestones: milestones.length > 0,
    nextMilestone: milestones.find(m => m.status === 'pending' || m.status === 'in_progress'),
    overdueMilestones: milestones.filter(m => m.status === 'overdue')
  };
};
