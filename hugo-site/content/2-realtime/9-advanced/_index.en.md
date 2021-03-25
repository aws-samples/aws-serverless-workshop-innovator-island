+++
title = "Advanced questions"
weight = 99
+++

These are optional questions and challenges about this application. Click the chevron icon next to each question to see additional hints.

### Question 1 ###
{{%expand "Why is ride updated every minute? Which line in the code causes that?" %}}

- The answer lies in the stack you deployed in the previous module. `theme-park-ride-times`  (in the folder `1-app-deploy/ride-controller`).
- Look at the `template.yaml` file. Find the `UpdateRides` function. Check its "Events" property.

{{% /expand%}}

### Question 2 ###
{{%expand "How is the message passed from SNS to IoT topic?" %}}

-  In the Lambda function you created in this module, you add a "Trigger" from SNS. This causes Lambda to be invoked by the SNS message.

{{% /expand%}}

### Question 3 ###

{{%expand "How does the frontend application retrieve messages from the IoT topic?"  %}}

- The frontend opens a WebSocket with an IoT endpoint to receive messages from the IoT topic via MQTT (a pub-sub protocol). The code related to this is in the `theme-park-frontend` directory.
- Use CMD + Shift + F (or CTRL + Shift + F in Windows) to search all files in the `theme-park-frontend` directory. Use keywords like 'iot' or 'mqtt'.
- Search for `mqttClient.on`. Explore how mqttClient is initialized, how it obtains credential to authenticate with the endpoint, and how it handles mqttClient.on('message').

{{% /expand%}}