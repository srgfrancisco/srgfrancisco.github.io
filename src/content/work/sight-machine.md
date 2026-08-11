---
company: Sight Machine
role: Senior Site Reliability Engineer
periodStart: 2025-04
periodEnd: 2025-11
summary: "Ran a ~30-cluster AKS fleet across three continents and enabled GPU workloads."
stack: [Azure, AKS, Terraform, Atlantis, Flux, Kafka, PostgreSQL, Prometheus, Grafana, PagerDuty]
order: 2
verified: 2026-08-11
---

Sight Machine is a global big-data SaaS platform for manufacturing, running on
Azure. I was one of five SREs, as a contractor.

## Operating the fleet

The platform runs on roughly 30 Kubernetes clusters on AKS, spread across the
Americas, APAC and Europe. A five-person team covering that many clusters means
the work is mostly about leverage: what you can automate, what you can make
self-healing, and what you have to be woken up for.

The mission-critical stack underneath was nginx, PostgreSQL, Kafka, Prometheus,
Grafana, AlertManager and PagerDuty.

## GPU workloads on AKS

I enabled GPU workloads (NVIDIA Omniverse) on AKS, which is what made real-time
3D visualisation and digital-twin use cases possible on the platform. Getting
GPU nodes, drivers and scheduling to behave predictably in a managed Kubernetes
service is less glamorous than the demo it unlocks.

## Infrastructure as code and GitOps

I automated infrastructure with Terraform, Atlantis and GitHub, wiring IaC into
the CI/CD pipeline so infrastructure changes went through the same review path
as application changes.

GitOps reconciliation across the fleet ran on Flux. I operated and debugged it —
reconciliation behaviour, sync troubleshooting, drift — day to day. I did not
design that setup or write the repository structure; it was already in place
when I arrived.
