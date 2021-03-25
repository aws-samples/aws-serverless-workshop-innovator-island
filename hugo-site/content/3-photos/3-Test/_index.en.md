+++
title = "Test the feature"
weight = 14
+++

It's time to complete a full end-to-end test with the front-end application using your smartphone - this step requires the use of an iPhone or Android device. 

## If you are in an AWS workshop

In the workshop room, there are a number of physical greenscreens. Find an available greenscreen to take a selfie.

1. Open the published application URL from Amplify Console on your smartphone.
2. Click on a ride profile from the main map.
3. On the ride description page, click *Add ride photo*.
4. Position yourself in the greenscreen so that green completely fills the background, and your body and face are located in the middle of the frame.
5. Upload the photo.

## If you are in a virtual workshop

If you do not have access to a green screen, you can use the sample image provided in the repo.

1. Navigate back to your Cloud9 instance, and locate `3-photos/green-screen-test.jpg`. 
2. Right click on this image, and select *Download*.
3. You can now use this image in place of creating your own.

## After the upload

1. The frontend application will notify you when the photo is uploaded. You will see a second notification when the composited photo is ready to view.
2. You will see a *Gallery* icon has appeared in the toolbar of the application. Click on this icon to view your composited photo.
