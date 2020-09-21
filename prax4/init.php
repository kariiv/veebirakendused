<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
require 'connect.php';

if(!isset($_SESSION['messages'])) {
    $_SESSION['messages'] = array();
}

if (!isset($_SESSION['username'])) {
    $allowed_sites = array('login.php','register.php', 'users.php');
    
    $link = $_SERVER['REQUEST_URI'];
    $link_array = explode('/',$link);
    $page = end($link_array);

    if (!in_array($page, $allowed_sites) && !strpos($_SERVER['REQUEST_URI'], 'assets')) {
        array_push($_SESSION['messages'], "You are logged out");

        header("Location: login.php");
    }
} else {
    $username = $_SESSION['username'];
}

function print_messages() {
    $res = '<div style="position: fixed; top: 50px; right: 5px;">';

    while($mes = array_pop($_SESSION['messages'])){
        $res .= "<div id='joke0' style='opacity: 1;' class='toast fade show' role='alert' aria-live='assertive' aria-atomic='true'>
        <div class='toast-header'>
                <svg class='bd-placeholder-img rounded mr-2' width='20' height='20' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid slice' focusable='false' role='img'>
                    <rect width='100%' height='100%' fill='#007aff'></rect>
                </svg>
                <strong class='mr-auto'>News</strong>
                <small class='text-muted'>just for you</small>
            </div>
         <div class='toast-body'>$mes</div>
    </div>";
    }
    $res .= '</div>';
    return $res;
}

class Tweet {

    public $id;
    public $text;
    public $user;
    public $date;

    function __construct($id, $text, $user, $date) {
        $this->id = $id;
        $this->text = $text;
        $this->user = $user;
        $this->date = $date;
    }

    function getTweetHTML() {
        global $conn;
        global $username;

        $sql = "SELECT user FROM 186048_like WHERE tweet='$this->id';";
        $res = $conn->query($sql);
        $likes = $res->num_rows;

        $liked = false;
        if ($likes > 0) {
            while ($row = $res->fetch_assoc()) {
                $us = $row['user'];
                if ($us === $username) {
                    $liked = true;
                }
            }
        }

        $sql = "SELECT COUNT(*) as total FROM 186048_retweet WHERE tweet='$this->id';";

        $check = $conn->query($sql);
        $retweets = mysqli_fetch_assoc($check)['total'];


        echo "<div class='tweet'>
                <div style='display: flex;'>
                    <div><a href='user.php?u=$this->user'><img src='assets/profiles/"; 

        if (file_exists('assets/profiles/'.$this->user)) { echo $this->user;} else {echo 'default';}

        echo "' class='rounded-img' width='40px' height='40px'></a>
                    </div>
                    <div class='titles'>
                        <h5 id='title' class='title'>$this->user</h5>
                        <span id='title' class='title'>$this->date</span>
                    </div>
                </div>

                <p class='lyrics '><div class='lyrics' style='width: 400px;'>- \"$this->text</div>
                    <div class='main-triggers tweet-triggers'>
                    <form action='tweet.php?id=$this->id' method='post'><button class='btn-accept' name='retweet' type='submit'>$retweets <i class='fa fa-retweet'></i></button></form>
                    <form action='like.php?id=$this->id' method='post'><button class='btn-accept";
        if ($liked) {
            echo ' active';
        }
        echo "' name='like' type='submit'>$likes <i class='fa fa-thumbs-up'></i></button></form>
                    <form action='comment.php?id=$this->id' method='post'><input class='title text-title' name='text' placeholder='comment...' type='text' required>
                        <button class='btn-deny' name='comment' type='submit'><i class='fa fa-paper-plane'></i></button></form>
                    </div>
                </p>
            </div>";
    }

    function getComments() {
        global $conn;

        $sql = 'SELECT comment, user, created_at FROM 186048_comment WHERE tweet=\'' . $this->id . '\' ORDER BY created_at DESC;';
    
        $res = $conn->query($sql);

        echo "<div class='tweet-comment'>";
    
        if ($res->num_rows > 0) {
            while ($comment = $res->fetch_assoc()) {
                $creator = $comment["user"];
                $date = $comment["created_at"];
                $comm = $comment["comment"];

                echo "<div class='comment' wrap='off'><a href='user.php?u=$creator'><img src='assets/profiles/"; 
                if (file_exists('assets/profiles/'.$creator)) { echo $creator;} else {echo 'default';}
                echo "' class='rounded-img' height='24px' width='24px' /></a>$creator: '$comm</div>";
            }
        } else {
            echo "No comments";
        }
        echo "</div>";
    }
}