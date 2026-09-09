---
client: Muxi
title: Two datacenters to AWS for a payments platform
summary: "Led a payments migration to AWS and introduced Terraform to the company."
role: Senior Infrastructure Engineer
years: "2016–2017"
stack:
  [
    AWS,
    Terraform,
    Puppet,
    Tomcat,
    MySQL,
    HAProxy,
    Direct Connect,
    Red Hat Enterprise Linux,
  ]
order: 13
verified: 2026-08-12
---

## The company

Muxi was a payments company founded in 1993 in Rio de Janeiro, building the
embedded software inside point-of-sale terminals and the platform behind it:
patents in five countries, technology on more than three million devices,
customers in over forty countries, teams in Brazil, the United States and
Mexico. It was later acquired by Conductor and is now Dock.

## The problem

muxiPAY was the company's first SaaS product, and the infrastructure under it
was not built for that. Production ran on more than a hundred Linux servers,
Red Hat and CentOS, with MySQL, Tomcat, Apache HTTPd and HAProxy, split across
two physical datacenters in São Paulo and Rio de Janeiro. A SaaS product needs
to absorb traffic spikes and grow without a purchase order, and that estate
could do neither.

Two constraints came with the work. PCI-DSS compliance had to hold throughout,
because the platform processes card transactions. And updates had to ship
during business hours without downtime, which a manually operated estate does
not do.

## What I did

I led the migration of the systems and terabytes of data out of the
datacenters, and designed the target: a multi-account AWS architecture across
two regions and multiple VPCs, using EC2, S3, RDS, ElastiCache, SQS, Route 53,
IAM, CloudTrail, Config, VPN and Direct Connect. The work was done with
Claranet as managed services partner, on a hybrid reporting model, so this was
a joint delivery rather than a solo one. I also worked with my manager to hire
three engineers, bringing the team to five seniors and one junior, and ran the
weeklies and dailies that kept the workstreams unblocked.

This is where Terraform entered the company, in 2016. Every environment after
that was code, including a test environment identical to production, which is
only affordable when you are not building it by hand. Puppet handled
configuration management, with OpenLDAP, centralised rsyslog and NTP as the
supporting infrastructure that PCI-DSS requires. I built the company's first
CI/CD pipeline, an Angular front end onto S3 and CloudFront, which is what
turned "deploy" from an event into a daily occurrence with no downtime. GitLab
runners autoscaled on EC2 Spot instances.

Separately from the migration, I tuned the Java application servers, Tomcat 6
and 7, across HTTP, JDBC, JVM and garbage collection settings. That work cut
connection pool consumption by around 84%.

## Result

AWS and Claranet invited us to present the migration at AWS Summit São Paulo in
2017. PCI-DSS certification was obtained within three months on the
infrastructure I provisioned, then processing tens of thousands of financial
transactions a day. Multi-AZ improved uptime and SLA figures, though I have no
measured delta to quote. I was promoted from Senior Infrastructure Engineer to
Infrastructure Architect after the migration.

The honest framing of the business outcome is the one I gave at the time: the
company did not profit directly from the migration. The investment bought the
capacity to scale, and that capacity is what let it take on more customers.

## Coverage

Claranet published the project as a
[case study](https://www.claranet.com/br/cases/otimizacao-infraestrutura-ti-com-cloud-e-managed-services-da-claranet-muxi),
where I am quoted: "We needed a managed services partner offering quality,
speed and joint construction." The release gives my title as Infrastructure
Manager; my title at Muxi was Infrastructure Architect, reached after this
work.
