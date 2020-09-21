<?php
require 'init.php';

$sql = "SELECT username FROM 186048_user;";

$fetch = $conn->query($sql);

$data = array();
while ($row = mysqli_fetch_array($fetch)) {
    $user = $row['username'];
    array_push($data, $user);
}

header('Content-Type: application/json');
echo json_encode($data);