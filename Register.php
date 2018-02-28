<?php

	header("Access-Control-Allow-Origin: *");
	$conn = new mysqli("localhost","root","","users");

	if($conn->connect_error)
		die("Connection failed ".$conn->connect_error);

	$data = json_decode(file_get_contents("php://input"), true);

    $name = $data["name"];
    $email = $data["email"];
    $username = $data["username"];
    $password = $data["password"];

    $check_mail = "SELECT email FROM register WHERE email='$email'";

    $email_res = $conn->query($check_mail);

    if($email_res->num_rows>0){
    	echo "exists";
    }

    else{

    	$insert = "INSERT INTO register(name,email,username,password) VALUES('$name','$email','$username','$password')";

    	if($conn->query($insert)){
    		echo "success";
    	}

    	else{
    		echo "fail";
    	}
    }
?>
