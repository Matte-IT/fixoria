<?php

// Only accept POST requests from GitHub
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Log the request for debugging purposes
    file_put_contents('deploy.log', "Webhook received at " . date("Y-m-d H:i:s") . "\n", FILE_APPEND);
    
    // Get the payload from GitHub
    $payload = json_decode(file_get_contents('php://input'), true);
    
    // Optional: Verify the webhook secret for added security
    // Ensure you set the same secret in GitHub and replace below
    $secret = 'matteit_secret'; // Your secret
    if (!empty($secret)) {
        $signature = $_SERVER['HTTP_X_HUB_SIGNATURE'] ?? '';
        $calculated_signature = 'sha1=' . hash_hmac('sha1', file_get_contents('php://input'), $secret);
        if (!hash_equals($signature, $calculated_signature)) {
            file_put_contents('deploy.log', "Invalid signature at " . date("Y-m-d H:i:s") . "\n", FILE_APPEND);
            die('Invalid signature');
        }
    }

    // Log the payload for debugging purposes (optional)
    file_put_contents('deploy.log', "Payload: " . print_r($payload, true) . "\n", FILE_APPEND);

    // Run the deployment shell script
    $output = shell_exec('bash /home/matteitc/public_html/fixoria/fixoria-server/deploy.sh 2>&1');

    // Log the output of the shell script
    file_put_contents('deploy.log', "Deployment output: " . $output . "\n", FILE_APPEND);

    // Respond to GitHub
    http_response_code(200); // Send HTTP 200 OK
    echo 'Deployment initiated';
} else {
    // Respond to non-POST requests
    echo 'Invalid request method';
    http_response_code(405); // Method Not Allowed
}

?>
