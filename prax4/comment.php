<?php
require 'init.php';

try {
    if (isset($_POST['comment'])) {
        if (isset($_POST['text'])) {
            $text = mysqli_real_escape_string($conn, $_POST['text']);
            $id = mysqli_real_escape_string($conn, $_GET['id']);   

            if (strlen($text) < 2) {
                throw new Exception('Tweet too short');
            }
            if (strlen($text) > 255) {
                throw new Exception('Tweet too long');
            }

            $sql = 'INSERT INTO 186048_comment (user, tweet, comment) VALUES (\'' . $username . '\', ' . $id . ', \'' . $text . '\')';
            $check = $conn->query($sql);
            if (!$check) {
                throw new Exception('Tweet failed:'. $conn->error);
            }
            array_push($_SESSION['messages'], "Comment successful");
        }
    }
} catch (Exception $e) {
    array_push($_SESSION['messages'], $e->getMessage());
}

header('Location: ' . $_SERVER['HTTP_REFERER']);