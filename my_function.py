def lambda_handler(event, context):
    return ('Ryan says ' + event['keyword'])