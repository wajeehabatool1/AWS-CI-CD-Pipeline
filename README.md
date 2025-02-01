# AWS-CI-CD-Pipeline

---
## Create ECR (Elastic Container Registery)
Run the below command on aws-cli to create an ecr repository , 
``` bash
aws ecr create-repository --repository-name node-application-ecr --region ap-south-1
```

![image](https://github.com/user-attachments/assets/82e627b8-ee58-4b22-9c91-246a9b45e6ca)

---
## Create a S3 bucket
we will be storing the image definition such as container name , image URI in the S3 bucket
``` bash
 aws s3api create-bucket --bucket image-definition-bucket --region ap-south-1 --create-bucket-configuration LocationConstraint=ap-south-1
```

![image](https://github.com/user-attachments/assets/e09fe119-d17a-4a5d-8894-931cbda7829a)

---

## Build CodeBuild Project
1. Name the project && select the project type as RunnerProject
2. Select the Github as Runner provider

   ![image](https://github.com/user-attachments/assets/bf7b497f-81e8-402a-82ea-8687d50e215f)
3. Click on Manage account credentials. Select Personal access token  and Select Secrets Manager to store the github authentication token

   ![image](https://github.com/user-attachments/assets/eb379c66-2cf7-4c84-a321-1eb758d10cc5)
4. Make a new token or use the exisitng one. Generate a personal access token on github and and paste that in here

   ![image](https://github.com/user-attachments/assets/6c6a7d48-5d0e-4c6c-bc86-e7f1951d6570)
5. After successfuly connecting to secret manager, put the desired github repository url in here

   ![image](https://github.com/user-attachments/assets/7c287764-4690-41c1-bc79-be1fc5c0ddf6)
6. Under the Enviroment  Section make sure the compute is selected EC2, operating system as amazon linux , select the lastest image from the options, 

   ![image](https://github.com/user-attachments/assets/16db87ff-7f45-44b3-874d-aae1a8a7591c)
7. Select create a new Service Role , and make sure to copy that service role somewhere , because that will be used to assign permission to CodeBuild project later

   ![image](https://github.com/user-attachments/assets/bf2a36fd-6ccd-4967-acbb-c352966784a4)
8. Check the below box

   ![image](https://github.com/user-attachments/assets/416d6847-8b7d-4d95-b526-2250cc9f66e6)
9. Click on build project
10. we can see our github is successfuly linked with the codeBuild

    ![image](https://github.com/user-attachments/assets/68f7e0a4-9900-4a62-9958-371e3062e5c5)

11. now we will asign permission to CodeDeploy role to put objects in S3 and access the ECR to put images
  ``````````` bash
           {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::image-definition-bucket/*"
    },
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": [
        "ecr:PutImageTagMutability",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage",
        "ecr:BatchGetImage",
        "ecr:DescribeImages",
        "ecr:BatchCheckLayerAvailability",
        "ecr:InitiateLayerUpload",
        "ecr:GetDownloadUrlForLayer"
      ],
      "Resource": [
        "arn:aws:ecr:ap-south-1:339712865909:repository/node-application-ecr"
      ]
    },
    {
      "Sid": "VisualEditor2",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:DescribeRepositories"
      ],
      "Resource": "*"
    }
  ]
}

  ```````````
12. Trigger the build , after sometime you will see a successful status ensuring we have successfully build the docker image and pushed into the ecr

    ![image](https://github.com/user-attachments/assets/ee9c0299-8cac-4104-a9fa-4fb19efc4b09)

---
## Build ECS (Fargate ) Cluster
### Building Fargate Cluster
1. Name the cluster and select the infrastructure as AWS Fargate

   ![image](https://github.com/user-attachments/assets/20aaea0a-7250-477a-916d-5b34dde629ed)
### Creating Task Definition
1. Name the task definition, select launch type as AWS Fargate, choose the vCPUS and memory as per your choice (i will be using 5 vCpus and 1GB Memory)
2. Name the container the same as mentioned in imagedefinition.json . Select the port to 3000 because container is running at port 3000

   ![image](https://github.com/user-attachments/assets/c87b4bfe-5311-4ec3-aef3-5c7471e0552e)


  ![image](https://github.com/user-attachments/assets/0deb0246-7d64-4ffe-a818-d7168f177d3f)

  ![image](https://github.com/user-attachments/assets/e5c9b393-ff3f-4225-a9ed-bdaf19c7318f)
### Creating Service
1. select the compute option as launch type

   ![image](https://github.com/user-attachments/assets/6649377b-cbf8-432c-83e0-bcb5e08eaecb)

2. select the desired task definition from the given options and provide a name to this service

   ![image](https://github.com/user-attachments/assets/30fa7231-f2e9-4b87-bed2-966b3ec37d76)
3. under the Networking tab , choose the vpc, subnets and security groups. i will be using default for now
4. Make sure to turn on the Public Ip option

   ![image](https://github.com/user-attachments/assets/ad2a0e81-2fe4-4133-bf7d-54abd41a9de2)
5. click on create
6. now before accessing  application running we have to expose port 3000 to inbound traffic
7. Under the Task Configguration, click on the ENI ID 

   ![image](https://github.com/user-attachments/assets/709235e8-0ba4-42d7-9ebd-13c86e220a4d)
8. Then click on the security group and open the port 3000 for traffic

   ![image](https://github.com/user-attachments/assets/eee96c26-0cca-432f-be63-e9305bb12dfa)
9. Take the public ip from task configuration enter the url with the port 3000 you should be seeing this

    ![image](https://github.com/user-attachments/assets/5848eca8-6114-453c-b487-e1058ec706af)

   ![image](https://github.com/user-attachments/assets/792a0f48-1dbd-493f-a961-f76a6238d6ea)

   ![image](https://github.com/user-attachments/assets/b3d272d1-2233-4318-a04c-8875e599bde8)
---

## Creating Code Pipeline
Now we have codeBuild project and ECS(fargate) cluster , we will create code pipeline to automate the integration and deployment
1. Select Build Custom Pipeline
2. Select Execution mode as Queued
3. Choose create a new service role and copy the provided role name for later
4. Select github as a source

   ![image](https://github.com/user-attachments/assets/7c0a6016-2d7b-4f15-82d2-6a041a5b738a)
5. Click on Connecting
   
   ![image](https://github.com/user-attachments/assets/edc03e73-df52-44f9-9d2a-789ca1644908)
6. click on install a new app

   ![image](https://github.com/user-attachments/assets/d7169605-4be0-441c-855b-1931b9cd2535)

7. ![image](https://github.com/user-attachments/assets/1846d551-2fa4-48e7-9bc3-c0a07acbb189)
8. verify yourself with authentication token or password
9. now select the desired repository and click on connect

    ![image](https://github.com/user-attachments/assets/890f390a-01e4-4993-bc1a-0cf0dc477786)
10. Choose the repository and branch

    ![image](https://github.com/user-attachments/assets/c66ad548-9555-4749-9175-e535ebe0edad)
11. make sure it is marked, to run pipeline on every push and pull in the github repository

    ![image](https://github.com/user-attachments/assets/4f2fd26b-e6cd-4f36-bb05-ee9ab2a13d33)
12. select other build provider , choose the codebuild and select the codebuild project we made earlier

    ![image](https://github.com/user-attachments/assets/8b2d5582-8719-4c3f-88e9-3f065eb73c97)

13. Skip the test stage for now
14. Select the deploy resource as AWS ECS , then select the ECS cluster we made for this, same goes for service name
15. click on create pipeline

    ![image](https://github.com/user-attachments/assets/980840c8-7989-4e45-a95d-a042851e1c09)

    ![image](https://github.com/user-attachments/assets/a4fac196-fe3c-4c6f-be18-d2f9e8e6993c)

    ![image](https://github.com/user-attachments/assets/0f44716a-f96b-4ba0-85dd-feb1782b4d69)
16. As we can see code pipeline executed seemlessly

    ![image](https://github.com/user-attachments/assets/8c9a2585-6be2-4724-93ec-514550d8bd3a)
















   








