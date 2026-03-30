export type OssFamily =
  | 'platform-orchestration'
  | 'messaging-streaming'
  | 'database-data-platform'
  | 'application-runtime-framework'
  | 'identity-security-access'
  | 'observability-operations-tooling'
  | 'infrastructure-os';

export interface OssCatalogItem {
  name: string;
  family: OssFamily;
  aliases: string[];
}

const CATALOG: OssCatalogItem[] = [
  { name: 'Kubernetes', family: 'platform-orchestration', aliases: ['k8s'] },
  { name: 'OKD', family: 'platform-orchestration', aliases: [] },
  { name: 'Docker', family: 'platform-orchestration', aliases: ['docker engine'] },
  { name: 'CRI-O', family: 'platform-orchestration', aliases: ['crio'] },
  { name: 'Kubespray', family: 'platform-orchestration', aliases: [] },
  { name: 'Rancher Kubernetes Engine', family: 'platform-orchestration', aliases: ['rke'] },
  { name: 'Longhorn', family: 'platform-orchestration', aliases: [] },
  { name: 'KVM', family: 'platform-orchestration', aliases: [] },
  { name: 'containerd', family: 'platform-orchestration', aliases: [] },
  { name: 'Helm', family: 'platform-orchestration', aliases: ['helm charts'] },
  { name: 'Istio', family: 'platform-orchestration', aliases: ['service mesh'] },
  { name: 'OpenShift', family: 'platform-orchestration', aliases: ['red hat openshift'] },
  { name: 'OpenStack Magnum', family: 'platform-orchestration', aliases: ['magnum'] },
  { name: 'Nomad', family: 'platform-orchestration', aliases: ['hashicorp nomad'] },

  { name: 'Apache Kafka', family: 'messaging-streaming', aliases: ['kafka'] },
  { name: 'Apache ActiveMQ Classic', family: 'messaging-streaming', aliases: ['activemq'] },
  { name: 'Apache Camel', family: 'messaging-streaming', aliases: ['camel'] },
  { name: 'Apache CXF', family: 'messaging-streaming', aliases: ['cxf'] },
  { name: 'RabbitMQ', family: 'messaging-streaming', aliases: [] },
  { name: 'Apache Artemis', family: 'messaging-streaming', aliases: ['artemis'] },
  { name: 'NATS', family: 'messaging-streaming', aliases: [] },
  { name: 'Apache Pulsar', family: 'messaging-streaming', aliases: ['pulsar'] },
  { name: 'Apache NiFi', family: 'messaging-streaming', aliases: ['nifi'] },
  { name: 'Apache ZooKeeper', family: 'messaging-streaming', aliases: ['zookeeper'] },
  { name: 'Schema Registry', family: 'messaging-streaming', aliases: ['kafka schema registry'] },
  { name: 'Kafka Connect', family: 'messaging-streaming', aliases: [] },

  { name: 'MariaDB', family: 'database-data-platform', aliases: ['mariadb'] },
  { name: 'Redis', family: 'database-data-platform', aliases: ['redis cache'] },
  { name: 'Couchbase', family: 'database-data-platform', aliases: [] },
  { name: 'Apache Cassandra', family: 'database-data-platform', aliases: ['cassandra'] },
  { name: 'Apache HBase', family: 'database-data-platform', aliases: ['hbase'] },
  { name: 'Apache Hive', family: 'database-data-platform', aliases: ['hive'] },
  { name: 'Apache Hadoop', family: 'database-data-platform', aliases: ['hadoop'] },
  { name: 'PostgreSQL', family: 'database-data-platform', aliases: ['postgres', 'postgresql'] },
  { name: 'MySQL', family: 'database-data-platform', aliases: ['mysql'] },
  { name: 'MongoDB', family: 'database-data-platform', aliases: ['mongo'] },
  { name: 'Elasticsearch', family: 'database-data-platform', aliases: ['elastic'] },
  { name: 'OpenSearch', family: 'database-data-platform', aliases: [] },
  { name: 'Apache Spark', family: 'database-data-platform', aliases: ['spark'] },
  { name: 'Apache Flink', family: 'database-data-platform', aliases: ['flink'] },
  { name: 'Anaconda', family: 'database-data-platform', aliases: [] },
  { name: 'Keras', family: 'database-data-platform', aliases: [] },
  { name: 'TensorFlow', family: 'database-data-platform', aliases: ['tensorflow'] },
  { name: 'InfluxDB', family: 'database-data-platform', aliases: ['influx'] },
  { name: 'Neo4j', family: 'database-data-platform', aliases: [] },
  { name: 'ClickHouse', family: 'database-data-platform', aliases: ['click house'] },

  { name: 'Spring Boot', family: 'application-runtime-framework', aliases: ['springboot'] },
  { name: 'Spring Framework', family: 'application-runtime-framework', aliases: ['spring'] },
  { name: 'Node.js', family: 'application-runtime-framework', aliases: ['node', 'nodejs'] },
  { name: 'Jetty', family: 'application-runtime-framework', aliases: [] },
  { name: 'WildFly', family: 'application-runtime-framework', aliases: ['wildfly app server'] },
  { name: 'Ruby', family: 'application-runtime-framework', aliases: ['ruby runtime'] },
  { name: 'AngularJS', family: 'application-runtime-framework', aliases: ['angular js'] },
  { name: 'Bootstrap', family: 'application-runtime-framework', aliases: [] },
  { name: 'Zend', family: 'application-runtime-framework', aliases: ['zend framework'] },
  { name: 'Apache Tomcat', family: 'application-runtime-framework', aliases: ['tomcat'] },
  { name: 'OpenJDK', family: 'application-runtime-framework', aliases: ['jdk'] },
  { name: 'TomEE', family: 'application-runtime-framework', aliases: [] },
  { name: 'Quarkus', family: 'application-runtime-framework', aliases: [] },
  { name: 'Micronaut', family: 'application-runtime-framework', aliases: [] },
  { name: 'Vert.x', family: 'application-runtime-framework', aliases: ['vertx'] },
  { name: 'Express.js', family: 'application-runtime-framework', aliases: ['express'] },
  { name: 'React', family: 'application-runtime-framework', aliases: ['reactjs'] },
  { name: 'Vue.js', family: 'application-runtime-framework', aliases: ['vue'] },

  { name: 'Keycloak', family: 'identity-security-access', aliases: [] },
  { name: 'OpenVPN', family: 'identity-security-access', aliases: [] },
  { name: 'LinuxHA', family: 'identity-security-access', aliases: ['linux ha'] },
  { name: 'Puppet', family: 'identity-security-access', aliases: [] },
  { name: 'FreeIPA', family: 'identity-security-access', aliases: ['free ipa'] },
  { name: 'HashiCorp Vault', family: 'identity-security-access', aliases: ['vault'] },
  { name: 'cert-manager', family: 'identity-security-access', aliases: ['cert manager'] },
  { name: 'OpenLDAP', family: 'identity-security-access', aliases: ['ldap'] },
  { name: 'WireGuard', family: 'identity-security-access', aliases: ['wire guard'] },
  { name: 'OAuth2 Proxy', family: 'identity-security-access', aliases: ['oauth proxy'] },
  { name: 'Dex', family: 'identity-security-access', aliases: [] },
  { name: 'Wazuh', family: 'identity-security-access', aliases: [] },

  { name: 'Kibana', family: 'observability-operations-tooling', aliases: [] },
  { name: 'Logstash', family: 'observability-operations-tooling', aliases: [] },
  { name: 'Loki', family: 'observability-operations-tooling', aliases: [] },
  { name: 'Kapacitor', family: 'observability-operations-tooling', aliases: [] },
  { name: 'Kiali', family: 'observability-operations-tooling', aliases: [] },
  { name: 'SonarQube', family: 'observability-operations-tooling', aliases: ['sonarqube'] },
  { name: 'Sonatype Nexus', family: 'observability-operations-tooling', aliases: ['nexus'] },
  { name: 'Telegraf', family: 'observability-operations-tooling', aliases: [] },
  { name: 'Zipkin', family: 'observability-operations-tooling', aliases: [] },
  { name: 'Apache Airflow', family: 'observability-operations-tooling', aliases: ['airflow'] },
  { name: 'Jenkins', family: 'observability-operations-tooling', aliases: [] },
  { name: 'sqlmap', family: 'observability-operations-tooling', aliases: ['sql map'] },
  { name: 'Grafana', family: 'observability-operations-tooling', aliases: [] },
  { name: 'Prometheus', family: 'observability-operations-tooling', aliases: [] },
  { name: 'Alertmanager', family: 'observability-operations-tooling', aliases: ['alert manager'] },
  { name: 'Jaeger', family: 'observability-operations-tooling', aliases: [] },
  { name: 'Fluentd', family: 'observability-operations-tooling', aliases: [] },
  { name: 'Fluent Bit', family: 'observability-operations-tooling', aliases: ['fluentbit'] },
  { name: 'Graylog', family: 'observability-operations-tooling', aliases: [] },
  { name: 'Nagios', family: 'observability-operations-tooling', aliases: [] },

  { name: 'AlmaLinux', family: 'infrastructure-os', aliases: ['alma linux'] },
  { name: 'Rocky Linux', family: 'infrastructure-os', aliases: ['rocky'] },
  { name: 'CentOS', family: 'infrastructure-os', aliases: ['cent os'] },
  { name: 'NGINX', family: 'infrastructure-os', aliases: ['nginx'] },
];

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.+/\\_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const OSS_CATALOG: OssCatalogItem[] = CATALOG;

export const OSS_LOOKUP = new Map<string, OssCatalogItem>(
  CATALOG.flatMap((item) => {
    const keys = [item.name, ...item.aliases];
    return keys.map((key) => [normalizeKey(key), item] as const);
  })
);

export const OSS_FAMILY_LABEL: Record<OssFamily, string> = {
  'platform-orchestration': 'platform and orchestration',
  'messaging-streaming': 'messaging and streaming',
  'database-data-platform': 'database and data platform',
  'application-runtime-framework': 'application runtime and framework',
  'identity-security-access': 'identity, security, and access',
  'observability-operations-tooling': 'observability and operations tooling',
  'infrastructure-os': 'infrastructure and OS',
};

export const OSS_CATALOG_SIZE = OSS_CATALOG.length;
