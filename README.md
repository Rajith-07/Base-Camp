# Base-Camp — Smart Employee Onboarding & Identity Service

> A serverless, AWS-native employee onboarding system that automates identity provisioning, document collection, and multi-stage onboarding workflows — with real-time tracking via a web-based HR dashboard.

[![AWS](https://img.shields.io/badge/AWS-Serverless-orange?logo=amazon-aws)](https://aws.amazon.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![HTML](https://img.shields.io/badge/Frontend-HTML%2FJS-blue)](./frontend)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [AWS Services Used](#aws-services-used)
- [Features](#features)
- [Project Structure](#project-structure)
- [API Endpoints]()
- [Getting Started](#getting-started)
- [User Interface](#ui)
- [Backend (Lambda & Step Functions)](#backend)
- [Environment Variables](#environment-variables)
- [Contributing]()
- [License](#license)

---

<a name="overview"></a>
## Overview

**Base-Camp** streamlines the entire employee onboarding lifecycle using a fully serverless AWS architecture. HR teams can initiate onboarding, track progress in real-time, and manage identity provisioning — all through a clean web dashboard.

Key capabilities:
- Automated multi-stage onboarding workflows via AWS Step Functions
- Identity and access provisioning using Amazon Cognito
- Secure document collection and storage
- Real-time status tracking via an HR web dashboard

---

<a name="architecture"></a>
## Architecture

```
HR Dashboard (Frontend)
        │
        ▼
  Amazon API Gateway
        │
        ▼
  AWS Lambda Functions
   ┌────┴────┐
   │         │
   ▼         ▼
AWS Step   Amazon
Functions  Cognito
   │         │
   ▼         ▼
Amazon    Identity &
DynamoDB  Access Mgmt
   │
   ▼
Amazon S3
(Documents)
```

The frontend HR dashboard communicates with the backend via API Gateway, which triggers Lambda functions. AWS Step Functions orchestrate the multi-stage onboarding workflow while Cognito handles identity provisioning for new employees.

---

<a name="aws-services-used"></a>
## AWS Services Used

| Service | Purpose |
|---|---|
| **AWS Lambda** | Serverless compute for onboarding logic |
| **AWS Step Functions** | Multi-stage workflow orchestration |
| **Amazon DynamoDB** | Employee records and onboarding state storage |
| **Amazon Cognito** | Employee identity provisioning and authentication |
| **Amazon API Gateway** | RESTful API layer for frontend–backend communication |
| **Amazon S3** | Secure document storage |
| **Amazon CloudFront** | High Speed CDN |
| **AWS IAM** | Role-based access control |

---

<a name="features"></a>
## Features

- **Automated Onboarding Workflows** — Step Functions orchestrate multi-stage onboarding (account creation → document collection → access provisioning → policy signoff → Manager introduction meet → completion)
- **Identity Provisioning** — Automatically create and manage employee identities in Amazon Cognito
- **Document Collection** — Collect and store onboarding documents securely in S3
- **HR Dashboard** — Web interface for HR teams to initiate and monitor onboarding in real-time
- **Employee Onboarding Portal** - Web interface where employees submit personal details/preferences
- **Real-time Status Tracking** — Live updates on each employee's onboarding stage
- **Serverless & Scalable** — No infrastructure to manage; scales automatically with demand
- **Secure by Default** — Environment variables for secrets, IAM roles for least-privilege access

---

<a name="project-structure"></a>
## Project Structure

<p align="center"><img width="612" height="410" alt="image" src="https://github.com/user-attachments/assets/ce7dbda7-5d53-440b-b705-2d1ba3f095b4" /></p>

---

<a name="getting-started"></a>
## Getting Started

### Prerequisites

- AWS Account with appropriate permissions
- [AWS CLI](https://aws.amazon.com/cli/) configured
- Node.js 14+ or later (for Lambda functions)
- A modern web browser (for dashboards)

### 1. Clone the Repository

```bash
git clone https://github.com/Rajith-07/Base-Camp.git
cd Base-Camp
```

### 2. Configure AWS Services

Set up the required AWS services in your account:

```bash
# Configure AWS CLI
aws configure

# Deploy Lambda functions
cd backend/lambdas
# Deploy each Lambda function via AWS Console or AWS CLI
```

### 3. Set Environment Variables

Set environment variables in the AWS Lambda console under Configuration > Environment variables, or define them in a .env file for local development.

### 4. Deploy Step Functions

Deploy the state machine from the `backend/state-machine/` directory via the AWS Console or AWS CLI:

```bash
aws stepfunctions create-state-machine \
  --name "EmployeeOnboardingWorkflow" \
  --definition file://backend/state-machine/hrms-onboarding-workflow.json \
  --role-arn <YOUR_STEP_FUNCTIONS_ROLE_ARN>
```

### 5. Launch the Frontend

Open the Employee Onboarding forms in your browser:

```bash
cd frontend/dashboards
open employee-onboarding-form.html
# Or serve it via a static hosting service (S3 + CloudFront)
```

To Open HR dashboard:
```bash
cd frontend/dashboards
open hr-dashboard.html
# Or serve it via a static hosting service (S3 + CloudFront)
```
---

<a name="ui"></a>
## User Interface
### Employee Onboarding Form
Employees submit personal details, which generates a unique reference UUID as reference with an automated email receipt using amazon SES.

<img width="49%" height="1017" alt="image" src="https://github.com/user-attachments/assets/b11cec88-c158-4cb0-9001-384c53c1f195" />
<img width="49%" height="1002" alt="image" src="https://github.com/user-attachments/assets/49e30ee9-1274-4172-98d9-cf99a6002ba2" />

<p align="center">
<img width="49%" alt="image" src="https://github.com/user-attachments/assets/790e5e7f-29bb-4e0e-927b-51aac1727221" />
</p>


### HR Dashboard
HR can approve or deny submitted employee applications & track employee's onboarding status in real-time
<img width="49%" height="1006" alt="image" src="https://github.com/user-attachments/assets/870de8c0-72f6-4556-95fb-75f227d3dacf" />
<img width="49%" height="1015" alt="image" src="https://github.com/user-attachments/assets/f3c84eda-15ce-4e4e-9400-793e0985a722" />

<img width="49%" height="1018" alt="image" src="https://github.com/user-attachments/assets/88271e47-6ea5-4d46-bf5f-2878aa09ad7c" />
<img width="49%" height="1021" alt="image" src="https://github.com/user-attachments/assets/ab10a271-345d-4ab0-9e57-a44f55029397" />

### Onboarding Portal
Employee are redirected to an onboarding portal where they have to upload required document, fill IT preference, Sign company's policies and schedule a introduction meet woth manager.
<img width="49%" height="1015" alt="image" src="https://github.com/user-attachments/assets/90e51f53-408e-44dd-9040-dd67e4ff4c99" />
<img width="49%" height="1025" alt="image" src="https://github.com/user-attachments/assets/23d341af-e4b2-4b54-abf9-cdf83d551e1d" />

<img width="49%" height="1026" alt="image" src="https://github.com/user-attachments/assets/80baa53e-1bb0-4bec-9771-ebbd760a3176" />

<img width="49%" height="1020" alt="image" src="https://github.com/user-attachments/assets/078e079c-0a62-41db-88e0-0c84285a9fb7" />
<img width="49%" height="1029" alt="image" src="https://github.com/user-attachments/assets/514a7eb1-4729-4f99-8e46-fb341a3b05d3" />

<img width="49%" height="1003" alt="image" src="https://github.com/user-attachments/assets/0fc74d04-28fa-42ce-8c89-0ffaebe39ccc" />

<img width="49%" height="1022" alt="image" src="https://github.com/user-attachments/assets/9b729297-4e3e-4115-8a35-57dd02419d66" />

<img width="49%" height="1020" alt="image" src="https://github.com/user-attachments/assets/19d655b7-51ef-47b5-a9e4-461810c21e7d" />

---

<a name="backend"></a>
## Backend (Lambda & Step Functions)

The backend consists of AWS Lambda functions triggered by API Gateway and orchestrated by Step Functions.

**Onboarding Workflow Stages:**

```
1. Initiate Onboarding
        ↓
2. Collect & Store Documents (S3)
        ↓
3. Provision Employee IT preference
        ↓
4. Confirm Policy Signoffs
        ↓
5. Schedule Manager Introduction Meeting
        ↓
6. Notify Completion
```

Each stage is an individual Lambda function, and the state machine manages transitions, retries, and error handling.

---

<a name="environment-variables"></a>
## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# AWS Region
AWS_REGION=<region>

# DynamoDB
DYNAMODB_TABLE_NAME=<table-name>

# Cognito
COGNITO_USER_POOL_ID=<region>_xxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# S3
S3_BUCKET_NAME=<s3-bucket-name>

# Step Functions
STATE_MACHINE_ARN=arn:aws:states:us-east-1:xxxxxxxxxxxx:stateMachine:<state-machine-name>

# API Gateway
API_GATEWAY_ENDPOINT=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/<deployment-stage>
```
---

<a name="license"></a>
## License

This project is licensed under the [MIT License](./LICENSE).
