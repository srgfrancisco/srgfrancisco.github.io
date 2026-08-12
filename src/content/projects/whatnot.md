---
client: Whatnot
title: SpellML to SageMaker
summary: "Moved a recommendation engine onto SageMaker and built the MLOps around it."
role: Cloud Architect
deliveredVia: Caylent
years: "2022–2023"
stack: [AWS, SageMaker, Terraform, GitHub Actions, TensorFlow, PyTorch]
order: 7
verified: 2026-08-11
---

## The company

Whatnot is a social marketplace for collectibles and goods, where discovery is
the product — what a buyer is shown decides what gets sold.

## The problem

Their recommendation engine ran on SpellML, and the platform had stopped fitting the problem in three
distinct ways: it struggled as data volumes and model complexity grew, its
rigidity slowed experimentation, and there was no mature MLOps practice
governing the model lifecycle.

The third one is the real constraint. A team can tolerate a slow platform; what
it cannot tolerate is not knowing which model is in production or how it got
there.

## What I built

The migration centred on **Amazon SageMaker**:

- **SageMaker Studio** for development environments
- **SageMaker Pipelines** for orchestrated training workflows — data ingestion,
  feature engineering, training, evaluation as discrete reviewable stages
- **SageMaker Endpoints** for real-time model serving
- **Terraform** for the infrastructure, **GitHub Actions** for CI/CD

Models were deployed as real-time endpoints and load tested before they carried
production traffic. The pipeline integrated with the MLOps tooling they already
had rather than replacing it wholesale.

## Result

Training and serving moved onto managed infrastructure that scales with the
data instead of against it, and experimentation cycles shortened because
standing up a variant stopped being an infrastructure task.

Cost optimisation came from the shape of the platform — pay-per-use pricing and
spot instances for training — rather than from any one tuning exercise.

This engagement did not publish quantitative outcomes.
