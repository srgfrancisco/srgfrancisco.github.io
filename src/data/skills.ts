/**
 * Derived from `skills-anos-experiencia.md`, the canonical table generated from
 * documented employment periods. Two rules carried over from that file:
 *
 * - `years` is the span since first professional use, which is the market
 *   convention for "years of experience". Where a skill is dormant it is
 *   marked, because an unqualified span on a dormant skill misleads and is
 *   trivially checkable.
 * - `years` is omitted where the source table has no confirmed figure. An
 *   invented number is worse than a blank.
 *
 * `note` exists to carry the depth caveats verbatim in spirit — operated
 * versus designed, tuned versus developed. Those are the distinctions that
 * decide whether an interview goes well.
 */
export type Level = 'Expert' | 'Strong' | 'Competent';

export interface Skill {
  name: string;
  years?: number;
  level: Level;
  dormant?: boolean;
  note?: string;
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

export const levelRank: Record<Level, number> = {
  Competent: 1,
  Strong: 2,
  Expert: 3,
};

export const groups: SkillGroup[] = [
  {
    name: 'Foundation',
    skills: [
      { name: 'Linux', years: 18, level: 'Expert' },
      { name: 'System administration', years: 18, level: 'Expert' },
      { name: 'Networking', years: 18, level: 'Expert' },
      { name: 'Bash', years: 18, level: 'Expert' },
      { name: 'Incident response and RCA', years: 18, level: 'Expert' },
      {
        name: 'Bare metal and datacentre',
        years: 8,
        level: 'Strong',
        dormant: true,
        note: '100+ servers across two datacentres. Ended 2019.',
      },
    ],
  },
  {
    name: 'Cloud',
    skills: [
      { name: 'AWS', years: 10, level: 'Expert' },
      { name: 'Amazon EKS', years: 4, level: 'Strong' },
      { name: 'Amazon ECS and Fargate', years: 4, level: 'Strong' },
      { name: 'Amazon VPC and endpoints', years: 10, level: 'Strong' },
      { name: 'AWS IAM', years: 10, level: 'Strong' },
      { name: 'Amazon S3', years: 10, level: 'Strong' },
      { name: 'Amazon RDS and Aurora', years: 10, level: 'Strong' },
      {
        name: 'Azure and AKS',
        years: 2,
        level: 'Competent',
        dormant: true,
        note: 'A 30-cluster AKS fleet across three continents, but only through 2025.',
      },
      {
        name: 'Google Cloud and GKE',
        years: 2,
        level: 'Competent',
        dormant: true,
        note: 'ETUS was the real depth. Dormant since 2023.',
      },
      {
        name: 'AWS Transit Gateway',
        years: 1,
        level: 'Competent',
        dormant: true,
        note: 'Designed the hub-and-spoke, then handed it on.',
      },
      {
        name: 'AWS Control Tower and Organizations',
        years: 1,
        level: 'Competent',
        dormant: true,
      },
      { name: 'Amazon SageMaker', years: 1, level: 'Competent', dormant: true },
      { name: 'AWS Graviton', years: 1, level: 'Competent', dormant: true },
      {
        name: 'AWS Secrets Manager and Credstash',
        years: 1,
        level: 'Competent',
        dormant: true,
      },
      { name: 'Amazon CloudFront', years: 3, level: 'Competent', dormant: true },
    ],
  },
  {
    name: 'Containers and GitOps',
    skills: [
      {
        name: 'Kubernetes',
        years: 6,
        level: 'Strong',
        note: 'Six years of span, four active. The 2023–2025 gap was all ECS.',
      },
      { name: 'Docker', years: 6, level: 'Strong' },
      {
        name: 'GitOps',
        years: 6,
        level: 'Strong',
        note: 'Three mechanisms across three clouds — GKE, Flux on AKS, Argo CD on EKS.',
      },
      {
        name: 'Helm',
        years: 1,
        level: 'Strong',
        dormant: true,
        note: 'Wrote charts and built custom packages. Authorship, not consumption.',
      },
      {
        name: 'Argo CD',
        years: 1,
        level: 'Strong',
        dormant: true,
        note: 'Applications and ApplicationSets, with Helm and Kustomize integrated. Kojo only.',
      },
      { name: 'Kustomize', years: 1, level: 'Competent', dormant: true },
      {
        name: 'Kargo',
        years: 1,
        level: 'Competent',
        dormant: true,
        note: 'Operated it as a platform user. Did not architect or deploy it.',
      },
      {
        name: 'Flux',
        years: 1,
        level: 'Competent',
        dormant: true,
        note: 'Operated and debugged reconciliation. Did not design the setup.',
      },
      { name: 'Karpenter', years: 1, level: 'Competent', dormant: true },
    ],
  },
  {
    name: 'Infrastructure as code and CI/CD',
    skills: [
      {
        name: 'Terraform',
        years: 10,
        level: 'Expert',
        note: 'Introduced it at Dock in 2016, during the move to AWS.',
      },
      { name: 'CI/CD', years: 10, level: 'Expert' },
      { name: 'GitHub Actions', years: 4, level: 'Strong' },
      {
        name: 'Packer',
        level: 'Strong',
        dormant: true,
        note: 'Hardened PCI-DSS AMIs, calling Ansible and Bash. Immutable infrastructure on EC2.',
      },
      { name: 'GitLab CI', years: 4, level: 'Competent', dormant: true },
      { name: 'Puppet', years: 4, level: 'Competent', dormant: true },
      {
        name: 'Ansible',
        years: 3,
        level: 'Competent',
        dormant: true,
        note: 'Only at Dock, on the cloud migration. Dormant since 2019.',
      },
      { name: 'Atlantis', years: 1, level: 'Competent', dormant: true },
      { name: 'CircleCI', years: 1, level: 'Competent', dormant: true },
      { name: 'Jenkins', years: 1, level: 'Competent', dormant: true },
    ],
  },
  {
    name: 'Reliability and observability',
    skills: [
      { name: 'Site reliability engineering', years: 6, level: 'Strong' },
      { name: 'Observability and monitoring', years: 6, level: 'Strong' },
      { name: 'Datadog', years: 6, level: 'Strong' },
      {
        name: 'SLO and SLI',
        years: 6,
        level: 'Strong',
        note: '99.99% at ETUS; 99% of API requests under two seconds at Kojo.',
      },
      { name: 'Amazon CloudWatch', years: 10, level: 'Strong' },
      {
        name: 'OpenTelemetry',
        years: 1,
        level: 'Strong',
        dormant: true,
        note: 'Org-wide rollout at Kojo, end to end.',
      },
      {
        name: 'Prometheus',
        years: 1,
        level: 'Competent',
        dormant: true,
        note: 'Essentially Sight Machine only.',
      },
      {
        name: 'Grafana',
        level: 'Competent',
        note: 'Four engagements. Start year not yet confirmed, so no figure is claimed.',
      },
      { name: 'PagerDuty', years: 1, level: 'Competent', dormant: true },
      { name: 'Sentry', years: 2, level: 'Competent', dormant: true },
      {
        name: 'Loki',
        level: 'Competent',
        dormant: true,
        note: 'Operated it. Never had to configure it.',
      },
    ],
  },
  {
    name: 'Data and performance',
    skills: [
      { name: 'PostgreSQL', years: 4, level: 'Strong' },
      {
        name: 'Performance tuning',
        years: 5,
        level: 'Strong',
        dormant: true,
        note: 'Tomcat and JVM at Dock (84% off the connection pool); Node heap and Postgres indexing at Kojo.',
      },
      {
        name: 'FinOps and cost optimisation',
        years: 1,
        level: 'Strong',
        dormant: true,
        note: '87.5% at CoinList; CI at near-neutral cost at Kojo.',
      },
      { name: 'Redis', years: 4, level: 'Competent', dormant: true },
      { name: 'MySQL', years: 4, level: 'Competent', dormant: true },
      {
        name: 'Elasticsearch and OpenSearch',
        level: 'Competent',
        dormant: true,
        note: 'Architected and implemented catalogue search at 4 Elements Music. Not a mastery claim.',
      },
      {
        name: 'Apache Kafka',
        years: 1,
        level: 'Competent',
        dormant: true,
        note: 'Part of the stack underneath me at Sight Machine. Operated, not mastered.',
      },
    ],
  },
  {
    name: 'Security and compliance',
    skills: [
      {
        name: 'PCI-DSS',
        years: 4,
        level: 'Strong',
        dormant: true,
        note: 'Provisioned the infrastructure that got the certification in three months.',
      },
      { name: 'VPN and IPsec', years: 4, level: 'Competent', dormant: true },
      { name: 'Firewalls', years: 4, level: 'Competent', dormant: true },
      {
        name: 'OIDC federation',
        years: 1,
        level: 'Competent',
        dormant: true,
        note: 'Removed long-lived AWS credentials from the delivery pipeline.',
      },
    ],
  },
  {
    name: 'Languages and AI',
    skills: [
      {
        name: 'AI-assisted development (Claude)',
        years: 2,
        level: 'Strong',
        note: 'ddogctl was built end to end this way, as was the Kojo CI migration.',
      },
      {
        name: 'Python',
        years: 10,
        level: 'Competent',
        note: 'In my stack since 2016. I read Python and I ship it with AI assistance — I designed and published ddogctl that way. I would not claim fluency writing it from scratch unassisted.',
      },
      {
        name: 'Java and Spring',
        years: 4,
        level: 'Competent',
        dormant: true,
        note: 'Application server tuning, not development.',
      },
      { name: 'Node.js', years: 1, level: 'Competent', dormant: true },
      { name: 'Ruby on Rails', years: 1, level: 'Competent', dormant: true },
      { name: 'Django', years: 1, level: 'Competent', dormant: true },
      { name: 'GraphQL', years: 1, level: 'Competent', dormant: true },
    ],
  },
  {
    name: 'Practice',
    skills: [
      { name: 'Technical documentation and runbooks', years: 18, level: 'Expert' },
      { name: 'Jira and Confluence', years: 13, level: 'Strong' },
      {
        name: 'Team leadership and mentoring',
        years: 2,
        level: 'Competent',
        dormant: true,
        note: 'Founded and ran the SRE team at ETUS; mentored engineers at Caylent.',
      },
    ],
  },
];
