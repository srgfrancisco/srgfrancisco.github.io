---
company: Dock
role: Infrastructure Architect
periodStart: 2014-11
periodEnd: 2019-07
summary: "Built PCI-DSS certified payment infrastructure and brought Terraform in-house."
stack: [AWS, Terraform, Puppet, Linux, MySQL, Tomcat, HAProxy, GitLab CI, PCI-DSS]
order: 6
verified: 2026-08-11
---

Four and a half years at a payments fintech — Muxi, later acquired by Conductor
and renamed Dock. I went from Infrastructure Engineer to Senior Infrastructure
Engineer, after the RHCE, to Infrastructure Architect. This is where the
physical-infrastructure grounding comes from: 100+ Linux servers across two
datacentres in São Paulo and Rio de Janeiro, running MySQL, Tomcat, Apache HTTPd
and HAProxy.

## PCI-DSS

I architected and deployed **PCI-DSS certified infrastructure** processing tens
of thousands of financial transactions a day, with a resilient microservices
platform for Java/Spring REST APIs. I provisioned the infrastructure that made
the certification possible in three months: OpenLDAP, centralised Rsyslog, NTP,
and Puppet for configuration management.

The certification was a company effort. My part was the infrastructure it stood
on, and I was directly involved in obtaining it.

## Moving to AWS

I designed **multi-account AWS** infrastructure across two regions with multiple
VPCs — EC2, S3, Route 53, RDS, ElastiCache, SQS, IAM, CloudTrail, Config, VPN,
Direct Connect. Leading the migration of systems and **terabytes** of data from
a traditional datacentre to AWS is what got me invited to present the case at
**AWS Summit São Paulo 2017**.

I **introduced Terraform to the company in 2016**, during that migration. That
is where my infrastructure-as-code practice starts — anchored in the period when
I was still racking and operating physical machines.

## Delivery and tuning

- The company's **first CI/CD pipeline** (Angular on S3 and CloudFront),
  enabling multiple deploys a day with zero downtime.
- **Autoscaling GitLab runners on EC2 Spot instances**.
- Java application server tuning on Tomcat 6/7 — HTTP, JDBC, JVM, garbage
  collection — cutting connection pool consumption by about **84%**.
