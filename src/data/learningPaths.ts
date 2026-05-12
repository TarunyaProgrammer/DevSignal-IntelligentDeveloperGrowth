import { 
  Code2, 
  Cpu, 
  Globe, 
  Terminal, 
  Database, 
  Search, 
  Shield, 
  Zap, 
  Layout, 
  Box, 
  Cloud, 
  Server, 
  Trophy,
  type LucideIcon
} from 'lucide-react';

export interface LearningLevel {
  level: number;
  title: string;
  description: string;
  platform: string;
  type: 'video' | 'docs' | 'course' | 'project' | 'article';
  url: string;
  estimatedTime: string;
}

export interface LearningPath {
  id: string;
  title: string;
  tagline: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalHours: number;
  accentColor: string;
  icon: LucideIcon; // master type safety
  levels: LearningLevel[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'advanced-react-patterns',
    title: 'Advanced React Patterns',
    tagline: 'Master high-performance rendering and virtualization in modern React apps.',
    category: 'Frontend',
    difficulty: 'Advanced',
    totalHours: 15,
    accentColor: '#61dafb',
    icon: Layout,
    levels: [
      {
        level: 1,
        title: 'Compound Components',
        description: 'Building flexible and reusable components using the compound pattern.',
        platform: 'Kent C. Dodds',
        type: 'article',
        url: 'https://kentcdodds.com/blog/compound-components-with-react-hooks',
        estimatedTime: '45 min'
      },
      {
        level: 2,
        title: 'Control Props Pattern',
        description: 'Giving users complete control over component state.',
        platform: 'Epic React',
        type: 'video',
        url: 'https://epicreact.dev/modules/advanced-react-patterns/control-props',
        estimatedTime: '1 hr'
      },
      {
        level: 3,
        title: 'Render Props & Children as a Function',
        description: 'Alternative ways to share logic between components.',
        platform: 'React Docs (Legacy)',
        type: 'docs',
        url: 'https://reactjs.org/docs/render-props.html',
        estimatedTime: '30 min'
      },
      {
        level: 4,
        title: 'Custom Hooks for Logic Extraction',
        description: 'Mastering the art of clean, composable logic.',
        platform: 'Frontend Masters',
        type: 'course',
        url: 'https://frontendmasters.com/courses/react-hooks/',
        estimatedTime: '2 hrs'
      },
      {
        level: 5,
        title: 'React.memo, useMemo, and useCallback',
        description: 'Deep dive into React performance optimization.',
        platform: 'Josh W. Comeau',
        type: 'article',
        url: 'https://www.joshwcomeau.com/react/usememo-and-usecallback/',
        estimatedTime: '1.5 hr'
      },
      {
        level: 6,
        title: 'Virtualization with react-window',
        description: 'Rendering massive datasets without lag.',
        platform: 'GitHub',
        type: 'project',
        url: 'https://github.com/bvaughn/react-window',
        estimatedTime: '1 hr'
      },
      {
        level: 7,
        title: 'Advanced Suspense & Transitions',
        description: 'Managing loading states and concurrent rendering.',
        platform: 'React.dev',
        type: 'docs',
        url: 'https://react.dev/reference/react/Suspense',
        estimatedTime: '1 hr'
      },
      {
        level: 8,
        title: 'Portals & Error Boundaries',
        description: 'Handling edge cases and UI architecture.',
        platform: 'Scrimba',
        type: 'video',
        url: 'https://scrimba.com/learn/react',
        estimatedTime: '45 min'
      },
      {
        level: 9,
        title: 'Building a Custom UI Library',
        description: 'Applying patterns to a real-world library setup.',
        platform: 'Storybook',
        type: 'docs',
        url: 'https://storybook.js.org/tutorials/design-systems-for-developers/',
        estimatedTime: '2 hrs'
      },
      {
        level: 10,
        title: 'Mastering the Fiber Reconciler',
        description: 'Understanding how React works under the hood.',
        platform: 'YouTube',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ZCuYPiUIONs',
        estimatedTime: '1 hr'
      }
    ]
  },
  {
    id: 'typescript-pro',
    title: 'TypeScript Professional',
    tagline: 'Go beyond basic types. Master generics, utility types, and type-level programming.',
    category: 'Fullstack',
    difficulty: 'Advanced',
    totalHours: 12,
    accentColor: '#3178c6',
    icon: Code2,
    levels: [
      {
        level: 1,
        title: 'Advanced Generics',
        description: 'Building truly flexible and type-safe functions.',
        platform: 'TypeScript Docs',
        type: 'docs',
        url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
        estimatedTime: '1 hr'
      },
      {
        level: 2,
        title: 'Conditional Types & Infer',
        description: 'The foundation of type-level logic.',
        platform: 'Total TypeScript',
        type: 'video',
        url: 'https://www.totaltypescript.com/tutorials/beginners-typescript',
        estimatedTime: '1.5 hr'
      },
      {
        level: 3,
        title: 'Mapped Types & Keyof',
        description: 'Transforming existing types into new ones.',
        platform: 'Frontend Masters',
        type: 'course',
        url: 'https://frontendmasters.com/courses/typescript-v3/',
        estimatedTime: '2 hrs'
      },
      {
        level: 4,
        title: 'Utility Types Deep Dive',
        description: 'Pick, Omit, Partial, and creating your own.',
        platform: 'TypeScript Handbook',
        type: 'docs',
        url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html',
        estimatedTime: '1 hr'
      },
      {
        level: 5,
        title: 'Template Literal Types',
        description: 'String manipulation in the type system.',
        platform: 'TypeScript Docs',
        type: 'docs',
        url: 'https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html',
        estimatedTime: '45 min'
      },
      {
        level: 6,
        title: 'Type-Level Programming Challenges',
        description: 'Solving complex puzzles on Type-Hero.',
        platform: 'Type-Hero',
        type: 'project',
        url: 'https://typehero.dev/',
        estimatedTime: '3 hrs'
      },
      {
        level: 7,
        title: 'Discriminated Unions & Exhaustiveness',
        description: 'Safe state management in TS.',
        platform: 'Marius Schulz',
        type: 'article',
        url: 'https://mariusschulz.com/blog/typescript-2-0-discriminated-unions',
        estimatedTime: '30 min'
      },
      {
        level: 8,
        title: 'Decorators (Experimental vs Stage 3)',
        description: 'Metadata and class transformations.',
        platform: 'TypeScript Docs',
        type: 'docs',
        url: 'https://www.typescriptlang.org/docs/handbook/decorators.html',
        estimatedTime: '1 hr'
      },
      {
        level: 9,
        title: 'Internal Architecture of TS Compiler',
        description: 'How the AST and Checker work.',
        platform: 'GitHub',
        type: 'docs',
        url: 'https://github.com/microsoft/TypeScript/wiki/Architectural-Overview',
        estimatedTime: '1 hr'
      },
      {
        level: 10,
        title: 'Build a Type-Safe Library',
        description: 'Publishing a small utility library with full types.',
        platform: 'GitHub',
        type: 'project',
        url: 'https://github.com/microsoft/TypeScript-Node-Starter',
        estimatedTime: '3 hrs'
      }
    ]
  },
  {
    id: 'system-design-fundamentals',
    title: 'System Design Fundamentals',
    tagline: 'Learn to design scalable, reliable, and maintainable systems.',
    category: 'Architecture',
    difficulty: 'Advanced',
    totalHours: 20,
    accentColor: '#ec4899',
    icon: Terminal,
    levels: [
      {
        level: 1,
        title: 'Client-Server Model & Load Balancing',
        description: 'Basics of traffic distribution.',
        platform: 'System Design Primer',
        type: 'article',
        url: 'https://github.com/donnemartin/system-design-primer',
        estimatedTime: '2 hrs'
      },
      {
        level: 2,
        title: 'Caching Strategies (Redis/Memcached)',
        description: 'Latency reduction and data management.',
        platform: 'ByteByteGo',
        type: 'video',
        url: 'https://www.youtube.com/@ByteByteGo',
        estimatedTime: '1.5 hr'
      },
      {
        level: 3,
        title: 'Database Sharding & Replication',
        description: 'Scaling data layers horizontally.',
        platform: 'Educative.io',
        type: 'course',
        url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers',
        estimatedTime: '3 hrs'
      },
      {
        level: 4,
        title: 'Microservices vs Monoliths',
        description: 'Architectural trade-offs.',
        platform: 'Martin Fowler',
        type: 'article',
        url: 'https://martinfowler.com/articles/microservices.html',
        estimatedTime: '1 hr'
      },
      {
        level: 5,
        title: 'Message Queues (Kafka/RabbitMQ)',
        description: 'Asynchronous communication patterns.',
        platform: 'Confluent Docs',
        type: 'docs',
        url: 'https://docs.confluent.io/current/get-started/index.html',
        estimatedTime: '2 hrs'
      },
      {
        level: 6,
        title: 'Consistent Hashing',
        description: 'Solving the re-sharding problem.',
        platform: 'YouTube',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=zaRkONvyGr8',
        estimatedTime: '45 min'
      },
      {
        level: 7,
        title: 'CAP Theorem & PACELC',
        description: 'Understanding distributed system constraints.',
        platform: 'Wikipedia',
        type: 'article',
        url: 'https://en.wikipedia.org/wiki/CAP_theorem',
        estimatedTime: '1 hr'
      },
      {
        level: 8,
        title: 'API Design & Rate Limiting',
        description: 'Building robust public interfaces.',
        platform: 'Google Cloud Docs',
        type: 'docs',
        url: 'https://cloud.google.com/architecture/api-design-guide',
        estimatedTime: '2 hrs'
      },
      {
        level: 9,
        title: 'Designing for Fault Tolerance',
        description: 'Circuit breakers and retries.',
        platform: 'Microsoft Azure Docs',
        type: 'docs',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker',
        estimatedTime: '1 hr'
      },
      {
        level: 10,
        title: 'Full System Design Mock Interview',
        description: 'Design a system like WhatsApp or Twitter.',
        platform: 'Exponent',
        type: 'video',
        url: 'https://www.tryexponent.com/courses/system-design',
        estimatedTime: '2 hrs'
      }
    ]
  },
  {
    id: 'backend-mastery-node',
    title: 'Backend Mastery (Node.js)',
    tagline: 'Deep dive into event loop, streams, and enterprise Node.js.',
    category: 'Fullstack',
    difficulty: 'Advanced',
    totalHours: 25,
    accentColor: '#68a063',
    icon: Server,
    levels: [
      { level: 1, title: 'Node.js Event Loop', description: 'How Node works internally.', platform: 'Node.js Docs', type: 'docs', url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/', estimatedTime: '1 hr' },
      { level: 2, title: 'Mastering Streams & Buffers', description: 'Efficient data processing.', platform: 'Node.js Docs', type: 'docs', url: 'https://nodejs.org/api/stream.html', estimatedTime: '2 hrs' },
      { level: 3, title: 'Express Enterprise Patterns', description: 'Middleware and architecture.', platform: 'Express.js', type: 'docs', url: 'https://expressjs.com/en/advanced/best-practice-performance.html', estimatedTime: '1.5 hr' },
      { level: 4, title: 'Authentication with JWT & OAuth', description: 'Secure user access.', platform: 'Auth0', type: 'article', url: 'https://auth0.com/blog/refresh-tokens-what-are-they-and-why-use-them/', estimatedTime: '2 hrs' },
      { level: 5, title: 'ORM Mastery with Prisma', description: 'Type-safe database access.', platform: 'Prisma.io', type: 'docs', url: 'https://www.prisma.io/docs/getting-started', estimatedTime: '1.5 hr' },
      { level: 6, title: 'Unit Testing with Jest', description: 'Ensuring code reliability.', platform: 'Jestjs.io', type: 'docs', url: 'https://jestjs.io/docs/getting-started', estimatedTime: '2 hrs' },
      { level: 7, title: 'Worker Threads & Clusters', description: 'Multicore utilization.', platform: 'Node.js Docs', type: 'docs', url: 'https://nodejs.org/api/worker_threads.html', estimatedTime: '1 hr' },
      { level: 8, title: 'Building Real-time with Socket.io', description: 'WebSockets and events.', platform: 'Socket.io', type: 'docs', url: 'https://socket.io/get-started/chat', estimatedTime: '2 hrs' },
      { level: 9, title: 'Dockerizing Node Apps', description: 'Containerization basics.', platform: 'Docker', type: 'docs', url: 'https://docs.docker.com/language/nodejs/', estimatedTime: '1 hr' },
      { level: 10, title: 'Build a Distributed File System', description: 'Final backend project.', platform: 'GitHub', type: 'project', url: 'https://github.com/nodejs/node', estimatedTime: '5 hrs' }
    ]
  },
  {
    id: 'ai-engineering-fundamentals',
    title: 'AI Engineering Fundamentals',
    tagline: 'Bridging the gap between software and artificial intelligence.',
    category: 'AI/ML',
    difficulty: 'Intermediate',
    totalHours: 15,
    accentColor: '#8b5cf6',
    icon: Cpu,
    levels: [
      { level: 1, title: 'Introduction to Machine Learning', description: 'Core concepts and terminology.', platform: 'Google', type: 'course', url: 'https://developers.google.com/machine-learning/crash-course', estimatedTime: '3 hrs' },
      { level: 2, title: 'Python for Data Science', description: 'NumPy and Pandas basics.', platform: 'Kaggle', type: 'course', url: 'https://www.kaggle.com/learn/python', estimatedTime: '2 hrs' },
      { level: 3, title: 'PyTorch vs TensorFlow', description: 'Understanding the frameworks.', platform: 'PyTorch', type: 'docs', url: 'https://pytorch.org/tutorials/beginner/basics/intro.html', estimatedTime: '2 hrs' },
      { level: 4, title: 'Training Your First Model', description: 'Classification and regression.', platform: 'Scikit-learn', type: 'docs', url: 'https://scikit-learn.org/stable/tutorial/basic/tutorial.html', estimatedTime: '2 hrs' },
      { level: 5, title: 'Deep Learning with CNNs', description: 'Computer vision basics.', platform: 'Fast.ai', type: 'course', url: 'https://course.fast.ai/', estimatedTime: '3 hrs' },
      { level: 6, title: 'NLP Fundamentals', description: 'Working with text data.', platform: 'Hugging Face', type: 'docs', url: 'https://huggingface.co/docs/transformers/index', estimatedTime: '2 hrs' },
      { level: 7, title: 'LLM Prompt Engineering', description: 'Maximizing AI output quality.', platform: 'OpenAI', type: 'docs', url: 'https://platform.openai.com/docs/guides/prompt-engineering', estimatedTime: '1 hr' },
      { level: 8, title: 'Vector Databases Basics', description: 'Storage for AI embeddings.', platform: 'Pinecone', type: 'article', url: 'https://www.pinecone.io/learn/vector-database/', estimatedTime: '1 hr' },
      { level: 9, title: 'Deploying Models with FastAPI', description: 'Serving AI over HTTP.', platform: 'FastAPI', type: 'docs', url: 'https://fastapi.tiangolo.com/', estimatedTime: '1.5 hr' },
      { level: 10, title: 'Build an Image Classifier App', description: 'Final AI project.', platform: 'GitHub', type: 'project', url: 'https://github.com/tensorflow/tensorflow', estimatedTime: '4 hrs' }
    ]
  },
  {
    id: 'devops-cloud-native',
    title: 'DevOps & Cloud Native',
    tagline: 'Master the art of deployment and infrastructure management.',
    category: 'Infrastructure',
    difficulty: 'Advanced',
    totalHours: 20,
    accentColor: '#0ea5e9',
    icon: Box,
    levels: [
      { level: 1, title: 'Infrastructure as Code (Terraform)', description: 'Defining cloud in code.', platform: 'HashiCorp', type: 'course', url: 'https://developer.hashicorp.com/terraform/tutorials', estimatedTime: '3 hrs' },
      { level: 2, title: 'CI/CD with GitHub Actions', description: 'Automating workflows.', platform: 'GitHub', type: 'docs', url: 'https://docs.github.com/en/actions', estimatedTime: '2 hrs' },
      { level: 3, title: 'Kubernetes Fundamentals', description: 'Orchestrating containers.', platform: 'Kubernetes.io', type: 'docs', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', estimatedTime: '3 hrs' },
      { level: 4, title: 'Monitoring with Prometheus & Grafana', description: 'System observability.', platform: 'Grafana', type: 'docs', url: 'https://grafana.com/docs/grafana/latest/getting-started/', estimatedTime: '2 hrs' },
      { level: 5, title: 'Service Mesh with Istio', description: 'Managing microservices traffic.', platform: 'Istio.io', type: 'docs', url: 'https://istio.io/latest/docs/setup/getting-started/', estimatedTime: '2 hrs' },
      { level: 6, title: 'Cloud Security Best Practices', description: 'Securing your infrastructure.', platform: 'AWS', type: 'docs', url: 'https://aws.amazon.com/architecture/security-identity-compliance/', estimatedTime: '2 hrs' },
      { level: 7, title: 'Serverless with AWS Lambda', description: 'Event-driven computing.', platform: 'AWS', type: 'course', url: 'https://aws.amazon.com/lambda/getting-started/', estimatedTime: '2 hrs' },
      { level: 8, title: 'Log Management with ELK Stack', description: 'Centralized logging.', platform: 'Elastic.co', type: 'docs', url: 'https://www.elastic.co/guide/index.html', estimatedTime: '2 hrs' },
      { level: 9, title: 'Helm Charts Mastery', description: 'Managing K8s packages.', platform: 'Helm.sh', type: 'docs', url: 'https://helm.sh/docs/intro/quickstart/', estimatedTime: '1 hr' },
      { level: 10, title: 'Build a Multi-region Cluster', description: 'Final DevOps project.', platform: 'GitHub', type: 'project', url: 'https://github.com/kubernetes/kubernetes', estimatedTime: '5 hrs' }
    ]
  },
  {
    id: 'cybersecurity-essentials',
    title: 'Cybersecurity Essentials',
    tagline: 'Defend your applications against modern threats.',
    category: 'Security',
    difficulty: 'Advanced',
    totalHours: 18,
    accentColor: '#ef4444',
    icon: Shield,
    levels: [
      { level: 1, title: 'OWASP Top 10', description: 'The most critical web risks.', platform: 'OWASP', type: 'docs', url: 'https://owasp.org/www-project-top-ten/', estimatedTime: '2 hrs' },
      { level: 2, title: 'Penetration Testing Basics', description: 'Ethical hacking intro.', platform: 'TryHackMe', type: 'course', url: 'https://tryhackme.com/module/introduction-to-cyber-security', estimatedTime: '3 hrs' },
      { level: 3, title: 'Network Security Fundamentals', description: 'Firewalls and VPNs.', platform: 'Cisco', type: 'course', url: 'https://www.netacad.com/courses/cybersecurity', estimatedTime: '2 hrs' },
      { level: 4, title: 'Cryptography 101', description: 'Encryption and hashing.', platform: 'Khan Academy', type: 'video', url: 'https://www.khanacademy.org/computing/computer-science/cryptography', estimatedTime: '2 hrs' },
      { level: 5, title: 'Secure Coding in Java/C++', description: 'Buffer overflows and memory.', platform: 'SANS Institute', type: 'article', url: 'https://www.sans.org/blog/secure-coding-best-practices/', estimatedTime: '1.5 hr' },
      { level: 6, title: 'Identity & Access Management', description: 'SAML, OAuth, and RBAC.', platform: 'Microsoft', type: 'docs', url: 'https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-whatis', estimatedTime: '1.5 hr' },
      { level: 7, title: 'Incident Response & Recovery', description: 'Handling data breaches.', platform: 'NIST', type: 'docs', url: 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final', estimatedTime: '2 hrs' },
      { level: 8, title: 'Cloud Security Posture Management', description: 'Auditing cloud resources.', platform: 'CheckPoint', type: 'article', url: 'https://www.checkpoint.com/cyber-hub/cloud-security/what-is-cspm/', estimatedTime: '1.5 hr' },
      { level: 9, title: 'Zero Trust Architecture', description: 'Never trust, always verify.', platform: 'Cloudflare', type: 'article', url: 'https://www.cloudflare.com/learning/security/glossary/what-is-zero-trust/', estimatedTime: '1 hr' },
      { level: 10, title: 'Perform a Security Audit', description: 'Final security project.', platform: 'GitHub', type: 'project', url: 'https://github.com/owasp/asvs', estimatedTime: '4 hrs' }
    ]
  },
  {
    id: 'database-internals',
    title: 'Database Internals',
    tagline: 'How databases work under the hood.',
    category: 'CS Fundamentals',
    difficulty: 'Advanced',
    totalHours: 22,
    accentColor: '#fbbf24',
    icon: Database,
    levels: [
      { level: 1, title: 'B-Trees & Indexing', description: 'The core of fast lookups.', platform: 'CMU DB', type: 'video', url: 'https://www.youtube.com/watch?v=uT7BstF-M-I', estimatedTime: '1.5 hr' },
      { level: 2, title: 'ACID Transactions & MVCC', description: 'Ensuring data consistency.', platform: 'PostgreSQL Docs', type: 'docs', url: 'https://www.postgresql.org/docs/current/mvcc.html', estimatedTime: '2 hrs' },
      { level: 3, title: 'Query Optimization Basics', description: 'How EXPLAIN works.', platform: 'MySQL Docs', type: 'docs', url: 'https://dev.mysql.com/doc/refman/8.0/en/execution-plan-information.html', estimatedTime: '1 hr' },
      { level: 4, title: 'Write-Ahead Logging (WAL)', description: 'Recovery and durability.', platform: 'SQLite Docs', type: 'docs', url: 'https://www.sqlite.org/wal.html', estimatedTime: '1 hr' },
      { level: 5, title: 'Distributed Consensus (Raft/Paxos)', description: 'Data agreement in clusters.', platform: 'Raft.github.io', type: 'article', url: 'https://raft.github.io/', estimatedTime: '2 hrs' },
      { level: 6, title: 'NoSQL Internals: LSM Trees', description: 'The storage engine for Cassandra.', platform: 'ScyllaDB', type: 'article', url: 'https://www.scylladb.com/glossary/lsm-tree/', estimatedTime: '1.5 hr' },
      { level: 7, title: 'Vector Search Algorithms (HNSW)', description: 'Indexing for AI data.', platform: 'Pinecone', type: 'article', url: 'https://www.pinecone.io/learn/hnsw/', estimatedTime: '2 hrs' },
      { level: 8, title: 'Database Benchmarking', description: 'Measuring IOPS and latency.', platform: 'Sysbench', type: 'project', url: 'https://github.com/akopytov/sysbench', estimatedTime: '2 hrs' },
      { level: 9, title: 'Custom Storage Engine Build', description: 'A simple KV store in C++/Rust.', platform: 'GitHub', type: 'project', url: 'https://github.com/facebook/rocksdb', estimatedTime: '5 hrs' },
      { level: 10, title: 'Advanced SQL Query Patterns', description: 'Window functions and CTEs.', platform: 'Mode', type: 'course', url: 'https://mode.com/sql-tutorial/', estimatedTime: '2 hrs' }
    ]
  },
  {
    id: 'ui-ux-design-for-devs',
    title: 'UI/UX Design for Devs',
    tagline: 'Build beautiful products without a designer.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    totalHours: 12,
    accentColor: '#3b82f6',
    icon: Layout,
    levels: [
      { level: 1, title: 'CSS Grid & Flexbox Mastery', description: 'Modern layout techniques.', platform: 'MDN', type: 'docs', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout', estimatedTime: '1 hr' },
      { level: 2, title: 'CSS Variables & Themes', description: 'Building dynamic design systems.', platform: 'Josh W. Comeau', type: 'article', url: 'https://www.joshwcomeau.com/css/css-variables-for-react-devs/', estimatedTime: '45 min' },
      { level: 3, title: 'Typography & Visual Hierarchy', description: 'Choosing and pairing fonts.', platform: 'Refactoring UI', type: 'course', url: 'https://www.refactoringui.com/', estimatedTime: '2 hrs' },
      { level: 4, title: 'Color Theory & Accessibility', description: 'WCAG and harmonious palettes.', platform: 'A11y Project', type: 'docs', url: 'https://www.a11yproject.com/', estimatedTime: '1 hr' },
      { level: 5, title: 'Micro-interactions with Framer Motion', description: 'Adding polish with animations.', platform: 'Framer.com', type: 'docs', url: 'https://www.framer.com/motion/', estimatedTime: '2 hrs' },
      { level: 6, title: 'Responsive Design Strategy', description: 'Mobile-first workflows.', platform: 'Web.dev', type: 'docs', url: 'https://web.dev/responsive-web-design-basics/', estimatedTime: '1 hr' },
      { level: 7, title: 'Figma for Developers', description: 'Extracting specs and assets.', platform: 'Figma', type: 'course', url: 'https://www.figma.com/resource-library/design-to-code/', estimatedTime: '1.5 hr' },
      { level: 8, title: 'Glassmorphism & Neomorphism', description: 'Modern aesthetic trends.', platform: 'CSS-Tricks', type: 'article', url: 'https://css-tricks.com/glassmorphism-creative-ux-and-ui-design-trend/', estimatedTime: '45 min' },
      { level: 9, title: 'SVG Animation Mastery', description: 'Lightweight vector motion.', platform: 'GSAP', type: 'docs', url: 'https://gsap.com/docs/v3/Plugins/DrawSVGPlugin', estimatedTime: '2 hrs' },
      { level: 10, title: 'Design a Dark Mode Dashboard', description: 'Final UI project.', platform: 'Dribbble', type: 'article', url: 'https://dribbble.com/tags/dashboard', estimatedTime: '3 hrs' }
    ]
  },
  {
    id: 'linux-command-line-wizardry',
    title: 'Linux Command Line Wizardry',
    tagline: 'The terminal is your greatest tool. Master it.',
    category: 'CS Fundamentals',
    difficulty: 'Intermediate',
    totalHours: 10,
    accentColor: '#10b981',
    icon: Terminal,
    levels: [
      { level: 1, title: 'Shell Basics: Bash & Zsh', description: 'Navigation and file ops.', platform: 'LinuxJourney', type: 'course', url: 'https://linuxjourney.com/lesson/the-shell', estimatedTime: '1 hr' },
      { level: 2, title: 'Piping & Redirection', description: 'Chaining commands efficiently.', platform: 'RyansTutorials', type: 'article', url: 'https://ryanstutorials.net/linuxtutorial/piping.php', estimatedTime: '1 hr' },
      { level: 3, title: 'Vim/Emacs Essentials', description: 'Editing files in the terminal.', platform: 'Vim-adventures', type: 'project', url: 'https://vim-adventures.com/', estimatedTime: '2 hrs' },
      { level: 4, title: 'Process Management', description: 'Jobs, backgrounding, and kill.', platform: 'DigitalOcean', type: 'article', url: 'https://www.digitalocean.com/community/tutorials/how-to-use-ps-kill-and-nice-to-manage-processes-in-linux', estimatedTime: '1 hr' },
      { level: 5, title: 'Shell Scripting Fundamentals', description: 'Automating repetitive tasks.', platform: 'LearnShell', type: 'course', url: 'https://www.learnshell.org/', estimatedTime: '2 hrs' },
      { level: 6, title: 'SSH & Remote Management', description: 'Securely accessing servers.', platform: 'Cloudflare', type: 'article', url: 'https://www.cloudflare.com/learning/access-management/what-is-ssh/', estimatedTime: '1 hr' },
      { level: 7, title: 'Networking Tools (curl, dig, nmap)', description: 'Debugging connections.', platform: 'Julia Evans', type: 'article', url: 'https://jvns.ca/blog/2019/10/28/blog-posts-about-networking/', estimatedTime: '1.5 hr' },
      { level: 8, title: 'Grepping & Regex in CLI', description: 'Advanced text searching.', platform: 'RegexOne', type: 'course', url: 'https://regexone.com/', estimatedTime: '1.5 hr' },
      { level: 9, title: 'Customizing your Dotfiles', description: 'Alias and prompt tuning.', platform: 'GitHub', type: 'project', url: 'https://dotfiles.github.io/', estimatedTime: '2 hrs' },
      { level: 10, title: 'Server Hardening Basics', description: 'Securing a fresh Linux box.', platform: 'Linode', type: 'article', url: 'https://www.linode.com/docs/guides/securing-your-server/', estimatedTime: '2 hrs' }
    ]
  },
  {
    id: 'performance-engineering',
    title: 'Performance Engineering',
    tagline: 'Every millisecond counts. Optimize your apps.',
    category: 'Fullstack',
    difficulty: 'Advanced',
    totalHours: 20,
    accentColor: '#f59e0b',
    icon: Zap,
    levels: [
      { level: 1, title: 'The Critical Rendering Path', description: 'How browsers paint pixels.', platform: 'Google Developers', type: 'docs', url: 'https://web.dev/critical-rendering-path/', estimatedTime: '1.5 hr' },
      { level: 2, title: 'Web Vitals & Lighthouse', description: 'Measuring modern performance.', platform: 'Web.dev', type: 'docs', url: 'https://web.dev/vitals/', estimatedTime: '1 hr' },
      { level: 3, title: 'Memory Leaks & Profiling', description: 'Debugging JS heap issues.', platform: 'Chrome DevTools', type: 'docs', url: 'https://developer.chrome.com/docs/devtools/memory/', estimatedTime: '2 hrs' },
      { level: 4, title: 'Network Optimization (HTTP/3)', description: 'Compression and caching.', platform: 'Cloudflare', type: 'article', url: 'https://www.cloudflare.com/learning/performance/http3-vs-http2/', estimatedTime: '1.5 hr' },
      { level: 5, title: 'Image & Asset Optimization', description: 'WebP, AVIF, and bundling.', platform: 'Imgix', type: 'article', url: 'https://blog.imgix.com/2021/01/26/avif-vs-webp-vs-jpeg', estimatedTime: '1 hr' },
      { level: 6, title: 'Web Workers & Off-main-thread', description: 'Parallelism in the browser.', platform: 'Surma.dev', type: 'article', url: 'https://surma.dev/things/web-workers-architecture/', estimatedTime: '2 hrs' },
      { level: 7, title: 'Database Query Tuning', description: 'Indices and plan analysis.', platform: 'Use the Index, Luke', type: 'course', url: 'https://use-the-index-luke.com/', estimatedTime: '2 hrs' },
      { level: 8, title: 'CDN Edge Computing', description: 'Moving logic closer to users.', platform: 'Cloudflare Workers', type: 'docs', url: 'https://developers.cloudflare.com/workers/', estimatedTime: '2 hrs' },
      { level: 9, title: 'Load Testing with k6', description: 'Simulating high traffic.', platform: 'k6.io', type: 'docs', url: 'https://k6.io/docs/', estimatedTime: '2 hrs' },
      { level: 10, title: 'Optimize a Legacy App', description: 'Real-world refactoring project.', platform: 'GitHub', type: 'project', url: 'https://github.com/GoogleChrome/lighthouse', estimatedTime: '4 hrs' }
    ]
  },
  {
    id: 'react-native-mobile',
    title: 'React Native Mobile',
    tagline: 'Build cross-platform mobile apps with React.',
    category: 'Mobile',
    difficulty: 'Intermediate',
    totalHours: 18,
    accentColor: '#61dafb',
    icon: Layout,
    levels: [
      { level: 1, title: 'Intro to React Native', description: 'Setup and core components.', platform: 'React Native Docs', type: 'docs', url: 'https://reactnative.dev/docs/getting-started', estimatedTime: '2 hrs' },
      { level: 2, title: 'Styling & Layout', description: 'Flexbox in mobile.', platform: 'React Native Docs', type: 'docs', url: 'https://reactnative.dev/docs/style', estimatedTime: '1 hr' },
      { level: 3, title: 'Navigation with React Navigation', description: 'Stacks, Tabs, and Drawers.', platform: 'React Navigation', type: 'docs', url: 'https://reactnavigation.org/docs/getting-started', estimatedTime: '2 hrs' },
      { level: 4, title: 'Handling User Input', description: 'Forms and buttons.', platform: 'React Native Docs', type: 'docs', url: 'https://reactnative.dev/docs/handling-text-input', estimatedTime: '1 hr' },
      { level: 5, title: 'Using Native APIs (Camera, GPS)', description: 'Expo vs Bare workflow.', platform: 'Expo Docs', type: 'docs', url: 'https://docs.expo.dev/versions/latest/sdk/camera/', estimatedTime: '2 hrs' },
      { level: 6, title: 'State Management in RN', description: 'Context and Redux ToolKit.', platform: 'Redux', type: 'docs', url: 'https://redux-toolkit.js.org/tutorials/quick-start', estimatedTime: '2 hrs' },
      { level: 7, title: 'Animations with Reanimated', description: '60fps mobile motion.', platform: 'Software Mansion', type: 'docs', url: 'https://docs.swmansion.com/react-native-reanimated/', estimatedTime: '2 hrs' },
      { level: 8, title: 'Testing with Detox', description: 'E2E mobile testing.', platform: 'Wix', type: 'docs', url: 'https://wix.github.io/Detox/', estimatedTime: '2 hrs' },
      { level: 9, title: 'Publishing to App Stores', description: 'App Store and Play Store.', platform: 'React Native Docs', type: 'docs', url: 'https://reactnative.dev/docs/publishing-to-app-store', estimatedTime: '2 hrs' },
      { level: 10, title: 'Build a Social Media App', description: 'Final mobile project.', platform: 'GitHub', type: 'project', url: 'https://github.com/react-native-community/react-native-template-typescript', estimatedTime: '5 hrs' }
    ]
  },
  {
    id: 'rust-for-system-dev',
    title: 'Rust for Systems Dev',
    tagline: 'Memory safety without the garbage collector.',
    category: 'CS Fundamentals',
    difficulty: 'Advanced',
    totalHours: 25,
    accentColor: '#dea584',
    icon: Zap,
    levels: [
      { level: 1, title: 'The Rust Book', description: 'Intro to syntax and memory model.', platform: 'Rust-lang.org', type: 'course', url: 'https://doc.rust-lang.org/book/', estimatedTime: '4 hrs' },
      { level: 2, title: 'Ownership & Borrowing', description: 'The core of Rust safety.', platform: 'Rust-lang.org', type: 'docs', url: 'https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html', estimatedTime: '2 hrs' },
      { level: 3, title: 'Structs, Enums & Pattern Matching', description: 'Data modeling in Rust.', platform: 'Rust-lang.org', type: 'docs', url: 'https://doc.rust-lang.org/book/ch06-00-enums.html', estimatedTime: '1.5 hr' },
      { level: 4, title: 'Error Handling (Result/Option)', description: 'Safe failure modes.', platform: 'Rust-lang.org', type: 'docs', url: 'https://doc.rust-lang.org/book/ch09-00-error-handling.html', estimatedTime: '1 hr' },
      { level: 5, title: 'Traits & Generics', description: 'Polymorphism in Rust.', platform: 'Rust-lang.org', type: 'docs', url: 'https://doc.rust-lang.org/book/ch10-00-generics.html', estimatedTime: '2 hrs' },
      { level: 6, title: 'Concurreny & Threads', description: 'Safe parallel execution.', platform: 'Rust-lang.org', type: 'docs', url: 'https://doc.rust-lang.org/book/ch16-00-concurrency.html', estimatedTime: '2 hrs' },
      { level: 7, title: 'Smart Pointers (Box, Rc, Arc)', description: 'Memory management patterns.', platform: 'Rust-lang.org', type: 'docs', url: 'https://doc.rust-lang.org/book/ch15-00-smart-pointers.html', estimatedTime: '2 hrs' },
      { level: 8, title: 'Unsafe Rust & FFI', description: 'Breaking the rules safely.', platform: 'Rust-lang.org', type: 'docs', url: 'https://doc.rust-lang.org/nomicon/', estimatedTime: '2 hrs' },
      { level: 9, title: 'WASM with Rust', description: 'Running Rust in the browser.', platform: 'Rustwasm', type: 'docs', url: 'https://rustwasm.github.io/docs/book/', estimatedTime: '2 hrs' },
      { level: 10, title: 'Build a CLI Tool', description: 'Final Rust project.', platform: 'GitHub', type: 'project', url: 'https://github.com/rust-lang/cargo', estimatedTime: '4 hrs' }
    ]
  },
  {
    id: 'cloud-architecture-aws',
    title: 'Cloud Architecture (AWS)',
    tagline: 'Design and deploy scalable cloud solutions.',
    category: 'Infrastructure',
    difficulty: 'Advanced',
    totalHours: 20,
    accentColor: '#ff9900',
    icon: Cloud,
    levels: [
      { level: 1, title: 'AWS Global Infrastructure', description: 'Regions, AZs, and Edge locations.', platform: 'AWS', type: 'docs', url: 'https://aws.amazon.com/about-aws/global-infrastructure/', estimatedTime: '1 hr' },
      { level: 2, title: 'Compute Services (EC2, Lambda)', description: 'Choosing the right compute.', platform: 'AWS', type: 'course', url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials', estimatedTime: '2 hrs' },
      { level: 3, title: 'Storage (S3, EBS, EFS)', description: 'Data storage strategies.', platform: 'AWS', type: 'docs', url: 'https://aws.amazon.com/s3/', estimatedTime: '1.5 hr' },
      { level: 4, title: 'Networking (VPC, Route53)', description: 'Building secure networks.', platform: 'AWS', type: 'docs', url: 'https://aws.amazon.com/vpc/', estimatedTime: '2 hrs' },
      { level: 5, title: 'Databases (RDS, DynamoDB)', description: 'Managed data solutions.', platform: 'AWS', type: 'docs', url: 'https://aws.amazon.com/rds/', estimatedTime: '2 hrs' },
      { level: 6, title: 'Security & Identity (IAM)', description: 'Managing permissions.', platform: 'AWS', type: 'docs', url: 'https://aws.amazon.com/iam/', estimatedTime: '1.5 hr' },
      { level: 7, title: 'Serverless Architecture Patterns', description: 'Building without servers.', platform: 'AWS', type: 'article', url: 'https://aws.amazon.com/serverless/', estimatedTime: '2 hrs' },
      { level: 8, title: 'AWS Well-Architected Framework', description: 'Best practices for cloud.', platform: 'AWS', type: 'docs', url: 'https://aws.amazon.com/architecture/well-architected/', estimatedTime: '2 hrs' },
      { level: 9, title: 'Monitoring with CloudWatch', description: 'Logging and alerting.', platform: 'AWS', type: 'docs', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html', estimatedTime: '1.5 hr' },
      { level: 10, title: 'Build a Serverless API', description: 'Final cloud project.', platform: 'GitHub', type: 'project', url: 'https://github.com/aws-samples/aws-serverless-workshops', estimatedTime: '4 hrs' }
    ]
  },
  {
    id: 'data-structures-algorithms',
    title: 'Data Structures & Algorithms',
    tagline: 'Master the building blocks of efficient software.',
    category: 'CS Fundamentals',
    difficulty: 'Intermediate',
    totalHours: 30,
    accentColor: '#10b981',
    icon: Zap,
    levels: [
      { level: 1, title: 'Big O Notation', description: 'Analyzing algorithm efficiency.', platform: 'FreeCodeCamp', type: 'video', url: 'https://www.youtube.com/watch?v=itn09C2ZB9Y', estimatedTime: '1 hr' },
      { level: 2, title: 'Arrays & Linked Lists', description: 'Basic linear structures.', platform: 'Coursera', type: 'video', url: 'https://www.coursera.org/lecture/data-structures/arrays-osHDA', estimatedTime: '2 hrs' },
      { level: 3, title: 'Stacks & Queues', description: 'LIFO and FIFO patterns.', platform: 'GeeksforGeeks', type: 'article', url: 'https://www.geeksforgeeks.org/stack-data-structure/', estimatedTime: '1.5 hr' },
      { level: 4, title: 'Hash Tables Mastery', description: 'Fast data lookup.', platform: 'YouTube', type: 'video', url: 'https://www.youtube.com/watch?v=shs09qePxyE', estimatedTime: '1 hr' },
      { level: 5, title: 'Trees & Binary Search Trees', description: 'Hierarchical data structures.', platform: 'mycodeschool', type: 'video', url: 'https://www.youtube.com/watch?v=H5JubkIy_p8', estimatedTime: '2 hrs' },
      { level: 6, title: 'Graphs & Traversals (BFS/DFS)', description: 'Modeling relationships.', platform: 'WilliamFiset', type: 'video', url: 'https://www.youtube.com/watch?v=09_LlHjoEiY', estimatedTime: '2 hrs' },
      { level: 7, title: 'Sorting Algorithms', description: 'QuickSort, MergeSort, and more.', platform: 'Toptal', type: 'article', url: 'https://www.toptal.com/developers/sorting-algorithms', estimatedTime: '2 hrs' },
      { level: 8, title: 'Dynamic Programming', description: 'Breaking down complex problems.', platform: 'FreeCodeCamp', type: 'video', url: 'https://www.youtube.com/watch?v=oBt53YbR9Kk', estimatedTime: '3 hrs' },
      { level: 9, title: 'Greedy Algorithms', description: 'Making locally optimal choices.', platform: 'HackerEarth', type: 'article', url: 'https://www.hackerearth.com/practice/algorithms/greedy/basics-of-greedy-algorithms/tutorial/', estimatedTime: '2 hrs' },
      { level: 10, title: 'Master the Coding Interview', description: 'Solving real-world patterns.', platform: 'LeetCode', type: 'project', url: 'https://leetcode.com/explore/interview/card/top-interview-questions-easy/', estimatedTime: '5 hrs' }
    ]
  },
  {
    id: 'git-expert-workflow',
    title: 'Git Expert Workflow',
    tagline: 'Version control is more than just commit and push.',
    category: 'Infrastructure',
    difficulty: 'Beginner',
    totalHours: 10,
    accentColor: '#f1502f',
    icon: Code2,
    levels: [
      { level: 1, title: 'Git Basics: Init, Add, Commit', description: 'Version control fundamentals.', platform: 'Git-scm.com', type: 'docs', url: 'https://git-scm.com/docs/gittutorial', estimatedTime: '1 hr' },
      { level: 2, title: 'Branching & Merging', description: 'Managing feature workflows.', platform: 'Atlassian', type: 'article', url: 'https://www.atlassian.com/git/tutorials/using-branches', estimatedTime: '1 hr' },
      { level: 3, title: 'Resolving Merge Conflicts', description: 'Handling code collisions.', platform: 'GitHub', type: 'docs', url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts', estimatedTime: '1 hr' },
      { level: 4, title: 'Git Rebase vs Merge', description: 'Keeping a clean history.', platform: 'FreeCodeCamp', type: 'article', url: 'https://www.freecodecamp.org/news/git-rebase-vs-merge/', estimatedTime: '1 hr' },
      { level: 5, title: 'Interactive Rebasing', description: 'Squashing and editing commits.', platform: 'Git-scm.com', type: 'docs', url: 'https://git-scm.com/docs/git-rebase#_interactive_mode', estimatedTime: '1.5 hr' },
      { level: 6, title: 'Git Stash & Cherry-pick', description: 'Moving code across branches.', platform: 'Atlassian', type: 'article', url: 'https://www.atlassian.com/git/tutorials/cherry-pick', estimatedTime: '1 hr' },
      { level: 7, title: 'Git Hooks for Automation', description: 'Running scripts on commit.', platform: 'Git-scm.com', type: 'docs', url: 'https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks', estimatedTime: '1.5 hr' },
      { level: 8, title: 'Managing Large Repos with LFS', description: 'Handling binary assets.', platform: 'GitHub', type: 'docs', url: 'https://docs.github.com/en/repositories/working-with-files/managing-large-files', estimatedTime: '1 hr' },
      { level: 9, title: 'Git Submodules & Monorepos', description: 'Managing complex dependencies.', platform: 'Atlassian', type: 'article', url: 'https://www.atlassian.com/git/tutorials/git-submodule', estimatedTime: '2 hrs' },
      { level: 10, title: 'Build a Git Workflow for Teams', description: 'Final Git project.', platform: 'GitHub', type: 'project', url: 'https://github.com/git/git', estimatedTime: '3 hrs' }
    ]
  },
  {
    id: 'web3-dapp-development',
    title: 'Web3 & dApp Development',
    tagline: 'Build decentralized applications on the blockchain.',
    category: 'Fullstack',
    difficulty: 'Advanced',
    totalHours: 25,
    accentColor: '#34d399',
    icon: Globe,
    levels: [
      { level: 1, title: 'Blockchain Fundamentals', description: 'How distributed ledgers work.', platform: 'Ethereum.org', type: 'docs', url: 'https://ethereum.org/en/developers/docs/intro-to-ethereum/', estimatedTime: '2 hrs' },
      { level: 2, title: 'Solidity Programming 101', description: 'Writing smart contracts.', platform: 'CryptoZombies', type: 'course', url: 'https://cryptozombies.io/', estimatedTime: '3 hrs' },
      { level: 3, title: 'Smart Contract Security', description: 'Common vulnerabilities.', platform: 'ConsenSys', type: 'docs', url: 'https://consensys.github.io/smart-contract-best-practices/', estimatedTime: '2 hrs' },
      { level: 4, title: 'Web3.js & Ethers.js', description: 'Connecting frontend to blockchain.', platform: 'Ethers.io', type: 'docs', url: 'https://docs.ethers.org/v5/', estimatedTime: '2 hrs' },
      { level: 5, title: 'Truffle & Hardhat Suites', description: 'Development environments.', platform: 'Hardhat.org', type: 'docs', url: 'https://hardhat.org/getting-started/', estimatedTime: '1.5 hr' },
      { level: 6, title: 'DeFi Protocols Deep Dive', description: 'Uniswap, Aave, and Compound.', platform: 'Uniswap Docs', type: 'docs', url: 'https://docs.uniswap.org/', estimatedTime: '2 hrs' },
      { level: 7, title: 'NFT Minting & Marketplaces', description: 'Building ERC-721/1155.', platform: 'OpenSea', type: 'docs', url: 'https://docs.opensea.io/', estimatedTime: '2 hrs' },
      { level: 8, title: 'DAO Governance Architecture', description: 'Voting and proposals.', platform: 'Snapshot', type: 'docs', url: 'https://docs.snapshot.org/', estimatedTime: '1.5 hr' },
      { level: 9, title: 'IPFS for Decentralized Storage', description: 'Off-chain data management.', platform: 'IPFS Docs', type: 'docs', url: 'https://docs.ipfs.tech/concepts/what-is-ipfs/', estimatedTime: '1 hr' },
      { level: 10, title: 'Build a Decentralized Exchange', description: 'Final Web3 project.', platform: 'GitHub', type: 'project', url: 'https://github.com/uniswap/v2-core', estimatedTime: '5 hrs' }
    ]
  },
  {
    id: 'advanced-seo-for-devs',
    title: 'Advanced SEO for Devs',
    tagline: 'Technical SEO: Make your apps discoverable.',
    category: 'Fullstack',
    difficulty: 'Intermediate',
    totalHours: 12,
    accentColor: '#10b981',
    icon: Search,
    levels: [
      { level: 1, title: 'How Search Engines Work', description: 'Crawling, indexing, ranking.', platform: 'Google', type: 'article', url: 'https://www.google.com/search/howsearchworks/', estimatedTime: '1 hr' },
      { level: 2, title: 'Core Web Vitals for SEO', description: 'Performance as a ranking factor.', platform: 'Web.dev', type: 'docs', url: 'https://web.dev/vitals/', estimatedTime: '1 hr' },
      { level: 3, title: 'Semantic HTML & Schema.org', description: 'Structured data for rich results.', platform: 'Schema.org', type: 'docs', url: 'https://schema.org/docs/gs.html', estimatedTime: '1.5 hr' },
      { level: 4, title: 'React SEO (SSR vs SSG)', description: 'Next.js and Remix patterns.', platform: 'Nextjs.org', type: 'docs', url: 'https://nextjs.org/docs/app/building-your-application/optimizing/metadata', estimatedTime: '2 hrs' },
      { level: 5, title: 'Robots.txt & Sitemaps', description: 'Directing the crawlers.', platform: 'Google Search Central', type: 'docs', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro', estimatedTime: '1 hr' },
      { level: 6, title: 'Internationalization (Hreflang)', description: 'Multi-region SEO.', platform: 'Google', type: 'docs', url: 'https://developers.google.com/search/docs/specialty/international/managing-multi-regional-and-multilingual-sites', estimatedTime: '1 hr' },
      { level: 7, title: 'Mobile-First Indexing', description: 'Optimizing for the mobile bot.', platform: 'Google', type: 'docs', url: 'https://developers.google.com/search/docs/crawling-indexing/mobile-sites/mobile-first-indexing', estimatedTime: '1 hr' },
      { level: 8, title: 'Backlink Analysis & PageRank', description: 'Understanding authority.', platform: 'Ahrefs', type: 'article', url: 'https://ahrefs.com/blog/google-pagerank/', estimatedTime: '1.5 hr' },
      { level: 9, title: 'SEO Auditing Tools', description: 'Screaming Frog and Ahrefs.', platform: 'GitHub', type: 'project', url: 'https://github.com/GoogleChrome/lighthouse', estimatedTime: '2 hrs' },
      { level: 10, title: 'Optimize a Content Platform', description: 'Final SEO project.', platform: 'GitHub', type: 'project', url: 'https://github.com/vercel/next.js/tree/canary/examples/blog-starter', estimatedTime: '3 hrs' }
    ]
  },
  {
    id: 'software-engineering-soft-skills',
    title: 'SWE Career & Soft Skills',
    tagline: 'Coding is only half the battle. Master the rest.',
    category: 'CS Fundamentals',
    difficulty: 'Beginner',
    totalHours: 10,
    accentColor: '#8b5cf6',
    icon: Trophy,
    levels: [
      { level: 1, title: 'Effective Communication', description: 'Writing clear emails and PRs.', platform: 'Harvard Business Review', type: 'article', url: 'https://hbr.org/2017/10/how-to-write-an-email-that-people-will-actually-read', estimatedTime: '1 hr' },
      { level: 2, title: 'Systematic Problem Solving', description: 'First principles thinking.', platform: 'Farnam Street', type: 'article', url: 'https://fs.blog/first-principles/', estimatedTime: '1 hr' },
      { level: 3, title: 'Time Management for Devs', description: 'Deep work and time blocking.', platform: 'Cal Newport', type: 'article', url: 'https://www.calnewport.com/blog/2012/11/21/deep-work-high-productivity-only-happens-when-you-overcome-shallow-distractions/', estimatedTime: '1 hr' },
      { level: 4, title: 'Mentorship & Pair Programming', description: 'Growing by helping others.', platform: 'Martin Fowler', type: 'article', url: 'https://martinfowler.com/articles/on-pair-programming.html', estimatedTime: '1 hr' },
      { level: 5, title: 'Public Speaking for Tech', description: 'Presenting at meetups.', platform: 'TED', type: 'video', url: 'https://www.ted.com/talks/chris_anderson_ted_s_secret_to_great_public_speaking', estimatedTime: '1.5 hr' },
      { level: 6, title: 'Technical Writing Mastery', description: 'Documentation and blogging.', platform: 'Google', type: 'course', url: 'https://developers.google.com/tech-writing', estimatedTime: '2 hrs' },
      { level: 7, title: 'Networking & Personal Branding', description: 'Building your dev presence.', platform: 'GitHub', type: 'article', url: 'https://github.com/readme/guides/personal-branding', estimatedTime: '1 hr' },
      { level: 8, title: 'Negotiation for Engineers', description: 'Salary and project scope.', platform: 'Haseeb Qureshi', type: 'article', url: 'https://www.haseebq.com/my-ten-rules-for-negotiating-a-job-offer/', estimatedTime: '1.5 hr' },
      { level: 9, title: 'Leadership & Team Management', description: 'Moving to senior/lead roles.', platform: 'Manager Tools', type: 'course', url: 'https://www.manager-tools.com/', estimatedTime: '2 hrs' },
      { level: 10, title: 'Create your 5-year Roadmap', description: 'Final soft skills project.', platform: 'Personal', type: 'article', url: 'https://www.freecodecamp.org/news/how-to-plan-your-software-engineering-career/', estimatedTime: '2 hrs' }
    ]
  },
  {
    id: 'llm-finetuning-prompting',
    title: 'LLM Fine-tuning & Prompting',
    tagline: 'Harness the power of Large Language Models.',
    category: 'AI/ML',
    difficulty: 'Advanced',
    totalHours: 15,
    accentColor: '#8b5cf6',
    icon: Cpu,
    levels: [
      { level: 1, title: 'Intro to Transformer Architecture', description: 'The engine behind LLMs.', platform: 'Jay Alammar', type: 'article', url: 'https://jalammar.github.io/illustrated-transformer/', estimatedTime: '2 hrs' },
      { level: 2, title: 'Prompt Engineering 101', description: 'Few-shot and chain-of-thought.', platform: 'OpenAI', type: 'docs', url: 'https://platform.openai.com/docs/guides/prompt-engineering', estimatedTime: '1.5 hr' },
      { level: 3, title: 'Using OpenAI API', description: 'Integrating models into apps.', platform: 'OpenAI', type: 'docs', url: 'https://platform.openai.com/docs/api-reference', estimatedTime: '1 hr' },
      { level: 4, title: 'LangChain & Vector DBs', description: 'Building context-aware AI.', platform: 'LangChain', type: 'docs', url: 'https://python.langchain.com/docs/get_started/introduction', estimatedTime: '2 hrs' },
      { level: 5, title: 'Hugging Face Transformers Library', description: 'Working with open-source models.', platform: 'Hugging Face', type: 'course', url: 'https://huggingface.co/learn/nlp-course/', estimatedTime: '2 hrs' },
      { level: 6, title: 'Fine-tuning with LoRA & QLoRA', description: 'Efficient model adaptation.', platform: 'Hugging Face', type: 'article', url: 'https://huggingface.co/blog/lora', estimatedTime: '2 hrs' },
      { level: 7, title: 'Quantization Basics', description: 'Running models on consumer hardware.', platform: 'Hugging Face', type: 'article', url: 'https://huggingface.co/blog/4bit-transformers-bitsandbytes', estimatedTime: '1.5 hr' },
      { level: 8, title: 'RAG: Retrieval Augmented Generation', description: 'Connecting LLMs to your data.', platform: 'Pinecone', type: 'article', url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/', estimatedTime: '2 hrs' },
      { level: 9, title: 'Local LLMs with Ollama', description: 'Private and secure AI.', platform: 'Ollama.com', type: 'docs', url: 'https://ollama.com/', estimatedTime: '1 hr' },
      { level: 10, title: 'Build a Custom AI Assistant', description: 'Final AI project.', platform: 'GitHub', type: 'project', url: 'https://github.com/hwchase17/langchain', estimatedTime: '3 hrs' }
    ]
  }
];
