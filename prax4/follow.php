<?php
require 'init.php';

try {
    if (isset($_GET['id'])) {

        $follow = mysqli_real_escape_string($conn, $_GET['id']);

        if ($username === $follow) {
            throw new Exception('U cannot follow yourself');
        }
        $sql = "SELECT COUNT(*) as total FROM 186048_follow WHERE user='$username' AND follow='$follow';";

        $check = $conn->query($sql);
        $data = mysqli_fetch_assoc($check);

        if ((int) $data['total'] > 0) {
            // Unfollow
            $sql = "DELETE FROM 186048_follow WHERE user='$username' AND follow='$follow'";
            $check = $conn->query($sql);

            if (!$check) {
                throw new Exception('Unfollowing failed:'. $conn->error);
            }
            array_push($_SESSION['messages'], "Not following");
        } else {
            // Follow
            $sql = 'INSERT INTO 186048_follow (user, follow) VALUES (\'' . $username. '\', \'' . $follow . '\')';
            $check = $conn->query($sql);

            if (!$check) {
                throw new Exception('Following failed:'. $conn->error);
            }
            array_push($_SESSION['messages'], "Following");
        }
    }
} catch (Exception $e) {
    array_push($_SESSION['messages'], $e->getMessage());
}

header('Location: ' . $_SERVER['HTTP_REFERER']);