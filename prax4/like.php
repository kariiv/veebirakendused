<?php
require 'init.php';

try {
    if (isset($_GET['id'])) {

        $tweet = mysqli_real_escape_string($conn, $_GET['id']);

        $sql = "SELECT COUNT(*) as total FROM 186048_like WHERE user='$username' AND tweet='$tweet';";

        $check = $conn->query($sql);
        $data = mysqli_fetch_assoc($check);

        if ((int) $data['total'] > 0) {
            // Unlike
            $sql = "DELETE FROM 186048_like WHERE user='$username' AND tweet='$tweet'";
            $check = $conn->query($sql);

            if (!$check) {
                throw new Exception('Remove Like failed:'. $conn->error);
            }
            array_push($_SESSION['messages'], "Not liked");
        } else {
            // Like
            $sql = 'INSERT INTO 186048_like (user, tweet) VALUES (\'' . $username. '\', \'' . $tweet . '\')';
            $check = $conn->query($sql);

            if (!$check) {
                throw new Exception('Like failed:'. $conn->error);
            }
            array_push($_SESSION['messages'], "Liked");
        }
    }
} catch (Exception $e) {
    array_push($_SESSION['messages'], $e->getMessage());
}

header('Location: ' . $_SERVER['HTTP_REFERER']);