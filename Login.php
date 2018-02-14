<?php
    header("Access-Control-Allow-Origin: *");
    $conn = new mysqli("localhost","root","","users");

    if($conn->connect_error)
        die("Connection failed ".$conn->connect_error);

    $data = json_decode(file_get_contents("php://input"), true);

  
    $username = $data["username"];
    $password = $data["password"];

    $check_mail = "SELECT username FROM register WHERE username='$username' AND password='$password'";

   
    $email_res = $conn->query($check_mail);

        if($email_res->num_rows>0){
            echo "success";
        }

        else{
            echo "fail";
        }
   
?>
