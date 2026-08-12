---
client: Sight Machine
title: GPU clusters for NVIDIA Omniverse digital twins
summary: "Per-customer AKS clusters with GPU nodes, delivered as repeatable Terraform."
role: Senior Site Reliability Engineer
deliveredVia: Curotec
years: "2025"
stack:
  [
    Azure,
    AKS,
    Terraform,
    Atlantis,
    NVIDIA Omniverse,
    DCGM Exporter,
    Prometheus,
    Grafana,
    Azure API Management,
  ]
order: 3
verified: 2026-08-12
---

## The company

Sight Machine builds industrial AI for manufacturers. The product this work
supported renders a physically accurate 3D digital twin of a customer's factory
and drives it with live production data, so an operator can look at the plant
rather than at a dashboard about the plant. The twin is built with OpenUSD and
NVIDIA Omniverse, streamed to the browser through Omniverse Kit App Streaming,
and rendered on NVIDIA A10 GPUs in Azure. The work reached NVIDIA through a
partnership with Microsoft, and I worked directly with engineers at both
companies. NVIDIA published the result as a
[case study](https://www.nvidia.com/en-us/case-studies/sight-machine/).

## The problem

Real-time 3D rendering needs GPUs, and every customer wanted the platform
inside their own Azure tenancy rather than ours. That made the deliverable a
whole environment, one per customer, built in a subscription we were given
access to and did not control. Each one had to be stood up correctly and
quickly, because the environment is what stands between a signed customer and a
running product.

## What I did

I owned the infrastructure for those deployments. Each customer got a dedicated
AKS cluster and everything around it: the VNet, API Management, digital
certificates, the workloads themselves, and a GPU node pool tainted so that only
the NVIDIA pods that need a GPU are scheduled onto the hardware being paid for.
Region and zone selection came first every time — GPU node sizes are not offered
everywhere, and picking the wrong zone is discovered late and paid for in
rework. The integration was announced in March 2025 and demonstrated publicly at
NVIDIA GTC.

All of it was Terraform, applied through Atlantis so that a deployment was a
reviewed pull request rather than someone's laptop. Observability was part of
the build rather than a follow-up: dcgm-exporter wired into the existing
Prometheus and Grafana stack, so GPU utilisation was visible from the first day
of each environment instead of being inferred from the Azure bill.

## Result

The Terraform modules were started by the engineer before me. I inherited them
and kept tightening them across deployments, and the time to bring up a new
customer environment fell steadily as a result — faster onboarding, less of the
per-customer improvisation that makes each environment slightly different from
the last. I have no measured figure for the reduction and do not claim one.

The product's own numbers are NVIDIA's to report, and it reports them: operators
at a US plant seeing up to 10% better line productivity and up to 15% higher
profit margins, with downtime issues resolved in minutes rather than hours.
Those are outcomes of the platform, not of my Terraform. They belong here only
because the platform ran on environments I built, and none of them happen if the
GPU clusters underneath are late, wrong or invisible.

## Coverage

The platform this infrastructure carried was written up publicly:

- [NVIDIA case study](https://www.nvidia.com/en-us/case-studies/sight-machine/) —
  the customer-facing account, including the reported plant results
- [NVIDIA blog](https://blogs.nvidia.com/blog/openusd-digital-twins-industrial-physical-ai/) —
  OpenUSD and Omniverse digital twins for industrial AI
- [Sight Machine announcement](https://www.sightmachine.com/news-nvidia-omniverse) —
  the March 2025 Omniverse integration
- [Microsoft Tech Community](https://techcommunity.microsoft.com/blog/iotblog/solving-the-data-challenge-for-manufacturers-with-sight-machine--azure-iot-opera/4470883) —
  the Azure IoT Operations side of the platform
