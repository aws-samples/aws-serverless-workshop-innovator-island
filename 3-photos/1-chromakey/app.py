import os
import json
import cv2
import logging
import boto3
import botocore

s3 = boto3.client('s3')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def upload_file(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then same as file_name
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = file_name

    # Upload the file
    s3_client = s3
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except botocore.exceptions.ClientError as e:
        logging.error(e)
        return False
    return True

def scale_image(image):
    _image = image
    target_height = 800

    height, width, channels = _image.shape
    logger.info('Original size: {}h x {}w'.format(height, width))
    scale = height/target_height
    if scale > 1:
        _image = cv2.resize(image, (int(width/scale), int(height/scale)))
        height, width, channels = image.shape
        logger.info('New size: {}h x {}w'.format(int(height/scale), int(width/scale)))
    return _image

def lambda_handler(event, context):

    print ("Starting handler")

    # get object metadata from event
    input_bucket_name = event['Records'][0]['s3']['bucket']['name']
    file_key = event['Records'][0]['s3']['object']['key']
    output_bucket_name = os.environ['OUTPUT_BUCKET_NAME']
    output_file_key = file_key.replace('.jpg', '.png')
    print("Input bucket: ", input_bucket_name)
    print("Output bucket: ", output_bucket_name)
    
    if output_bucket_name is None:
        print("Error: No OUTPUT_BUCKET_NAME environment variable specified.")
        return

    # set up local temp file names
    local_input_temp_file = '/tmp/' + file_key
    local_output_temp_file = '/tmp/out_' + file_key.replace('.jpg', '.png')
    logger.info('Local input file: {}'.format(local_input_temp_file))
    logger.info('Local output file: {}'.format(local_output_temp_file))

    # get the object
    s3.download_file(input_bucket_name, file_key, local_input_temp_file)

    # HSV range
    
    # (36, 25, 25) - most extreme
    # (36, 50, 50) - average
    # (36, 100, 100) - relaxed
    lower_range = eval(os.environ["HSV_LOWER"])

    # (70, 255, 255) - default
    upper_range = eval(os.environ["HSV_UPPER"])
    print('Lower HSV range: ', lower_range)
    print('Upper HSV range: ', upper_range)
    
    # Read in the file
    image = cv2.imread(local_input_temp_file)

    # Resize the image if larger than target size
    image = scale_image(image)
    
    # Flip from RGB of JPEG to BGR of OpenCV
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Convert BGR to HSV color space
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # convert to RGBA
    image_alpha = cv2.cvtColor(image, cv2.COLOR_BGR2RGBA)
    
    # Threshold the HSV image to only green colors
    mask = cv2.inRange(hsv, lower_range, upper_range)
    
    # Invert the mask (i.e. select everything not green)
    mask = ~mask
    
    # Extract the non-green parts of the image
    result = cv2.bitwise_and(image_alpha, image_alpha, mask=mask)
    
    #Save the result
    cv2.imwrite(local_output_temp_file,result)
    
    #Save to S3
    if upload_file(local_output_temp_file, output_bucket_name, output_file_key):
        print('Processed file uploaded.')
        
    return True
