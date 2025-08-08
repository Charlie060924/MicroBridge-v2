import { FAQ } from "@/types/faq";

const faqData: FAQ[] = [
  {
    id: 1,
    quest: "What is a micro-internship?",
    ans: "A micro-internship is a short-term, paid, professional project that's typically completed in 5-40 hours. They're a great way to get specific tasks done—like market research, content creation, or data analysis—without the commitment of hiring a full-time intern.",
  },
  {
    id: 2,
    quest: "How is MicroBridge different from other job platforms?",
    ans: "We're laser-focused on micro-internships for the Hong Kong market. Unlike traditional job boards, our platform is designed specifically for these short-term, skilled projects. Our smart matching algorithm connects you with the right student talent, and our bilingual interface and localized knowledge make the process simple and efficient.",
  },
  {
    id: 3,
    quest: "Is there a fee to use MicroBridge?",
    ans: "There are no fees for students to use the platform.",
  },
  {
    id: 4,
    quest: "How do I get paid?",
    ans: "Before you begin, the employer funds the project's payment, which we hold securely. Once you've completed the work and the employer approves it, the payment is released to you directly via Stripe Connect.",
  },
  {
    id: 5,
    quest:"Can I work on multiple projects at once",
    ans: "Yes, the flexible nature of micro-internships means you can take on multiple projects at once, provided you can manage your time effectively and meet all deadlines.",
  },
  {
    id: 6,
    quest: "How does the review system work?",
    ans: "After each project, both students and employers can leave reviews. This helps build trust and allows you to make informed decisions about future projects or hires.",
  },
];

export default faqData;
