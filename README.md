This repo contains the code needed to run Playwright on Lambda with a Docker Container. Just build and tag the image, upload to ECR, create a new lambda function with the image with an API Gateway (HTTP), and in the lambda console choose the latest image for deployment.


Example: https://am3uzqwad1.execute-api.us-west-2.amazonaws.com/default/playwright-image?url=https://example.com (You can change the URL query param)
(Please use the discussions page for questions/comments/etc.)
