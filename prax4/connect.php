<?php

$host = "127.0.0.1";
$username = "st2014";
$password = "progress";
$dbname = "st2014";

$conn = new mysqli($host,$username,$password, $dbname);

if($conn->connect_error) {
    die('Connection error: '. $conn->connect_error);
}
