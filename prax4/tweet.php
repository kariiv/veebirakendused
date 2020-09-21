<?php
require 'init.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === "POST") {
        if (isset($_POST['tweet'])) {
            if (isset($_POST['text'])) {
    
                $text = mysqli_real_escape_string($conn, $_POST['text']);
    
                if (strlen($text) < 2) {
                    throw new Exception('Tweet too short');
                }
                if (strlen($text) > 255) {
                    throw new Exception('Tweet too long');
                }
    
                $sql = 'INSERT INTO 186048_tweet (user, text) VALUES (\'' . $username . '\', \'' . $text . '\')';
                $check = $conn->query($sql);
    
                if (!$check) {
                    throw new Exception('Tweet failed:');
                }
                array_push($_SESSION['messages'], "Tweet successful");
            }
        }
    
        if (isset($_POST['retweet'])) {
            if (isset($_GET['id'])) {

                $tweet = mysqli_real_escape_string($conn, $_GET['id']);

                $sql = "SELECT id, text FROM 186048_tweet WHERE id='$tweet';";
                $res = $conn->query($sql);

                if ($res->num_rows !== 1) {
                    throw new Exception('Retweet failed: Tweet not found!');   
                }

                $row = $res->fetch_assoc();
                $text = $row['text'];

                $sql = 'INSERT INTO 186048_tweet (user, text) VALUES (\'' . $username . '\', \'' . $text . '\')';
                $check = $conn->query($sql);
                if (!$check) {
                    throw new Exception('Tweet creation failed');
                }

                $sql = 'INSERT INTO 186048_retweet (user, tweet) VALUES (\'' . $username . '\', ' . $row['id'] . ')';
                $check = $conn->query($sql);
                if (!$check) {
                    throw new Exception('Retweet creation failed');
                }

                array_push($_SESSION['messages'], $row['text'] . $row['id']);
                array_push($_SESSION['messages'], "Retweet successful");
            }
        }
    }
} catch (Exception $e) {
    array_push($_SESSION['messages'], $e->getMessage());
}
header('Location: ' . $_SERVER['HTTP_REFERER']);
