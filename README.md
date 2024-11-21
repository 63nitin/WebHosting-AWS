# Static Website Hosting with AWS Amplify and S3

This guide explains how to host a static website using AWS S3 and AWS Amplify. It also covers setting up AWS SES for email notifications.

---

## **Features**
- Host a static website using AWS Amplify and S3.
- Set up a contact form to send emails via AWS SES.

---

## **Steps to Host a Static Website**

### **1. Set Up AWS S3 for Static Hosting**
1. Log in to the [AWS Management Console](https://aws.amazon.com/).
2. Navigate to **S3**.
3. Click **Create Bucket** and:
   - Provide a bucket name (e.g., `my-static-site`).
   - Choose a region (e.g., `us-east-1`).
   - Disable block public access (uncheck "Block all public access") and confirm.
4. Go to the **bucket settings**:
   - Upload your `index.html` and other static files.
   - Set **permissions**:
     - In the "Permissions" tab, click **Bucket Policy**.
     - Add the following policy (replace `YOUR-BUCKET-NAME` with your bucket name):
       ```json
       {
         "Version": "2012-10-17",
         "Statement": [
           {
             "Sid": "PublicReadGetObject",
             "Effect": "Allow",
             "Principal": "*",
             "Action": "s3:GetObject",
             "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
           }
         ]
       }
       ```
5. Enable **Static Website Hosting**:
   - In the "Properties" tab, enable static website hosting.
   - Specify the `index.html` file for the **index document**.

### **2. Set Up AWS Amplify**
1. Go to the [AWS Amplify Console](https://aws.amazon.com/amplify/).
2. Click **Get Started** under **Host your web app**.
3. Connect your Git repository (GitHub, GitLab, etc.).
4. Select the branch to deploy and follow the on-screen instructions.
5. Amplify automatically builds and deploys your site. You’ll receive a unique URL for your website.

---

## **Adding a Contact Form with AWS SES**

### **1. Configure AWS SES**
1. Go to the [SES Console](https://console.aws.amazon.com/ses/).
2. Verify your email addresses:
   - **Sender Email**: The email you’ll use to send messages.
   - **Recipient Email**: Verify this if SES is in Sandbox mode.
3. (Optional) Move SES out of Sandbox mode for unrestricted sending:
   - In SES, go to **Sending Statistics** > **Request Production Access**.
   - Fill out the form and wait for approval.

### **2. Create an API Endpoint**
Use AWS Lambda and API Gateway to handle form submissions and send emails:
1. Write a Lambda function:
   ```javascript
   const AWS = require('aws-sdk');
   const SES = new AWS.SES();

   exports.handler = async (event) => {
     const { name, email, message } = JSON.parse(event.body);

     const params = {
       Source: 'your-email@example.com', // Replace with your verified email
       Destination: {
         ToAddresses: ['your-email@example.com'], // Replace with recipient email
       },
       Message: {
         Subject: {
           Data: `New Message from ${name}`,
         },
         Body: {
           Text: {
             Data: `You have a new message from ${email}:\n\n${message}`,
           },
         },
       },
     };

     try {
       await SES.sendEmail(params).promise();
       return {
         statusCode: 200,
         body: JSON.stringify({ message: 'Email sent successfully' }),
       };
     } catch (error) {
       return {
         statusCode: 500,
         body: JSON.stringify({ error: error.message }),
       };
     }
   };
