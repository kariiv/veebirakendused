<?php
require 'init.php';

try {
    if (isset($_POST['bio_submit'])) {
        $text = mysqli_real_escape_string($conn, $_POST['bio']);

        if (strlen($text) > 255) {
            throw new Exception('Bio too long');
        }

        $sql = 'UPDATE 186048_user SET bio=\'' . $text . '\' WHERE username=\'' . $username . '\';';

        $check = $conn->query($sql);

        if (!$check) {
            throw new Exception('Bio update failed');
        }

        array_push($_SESSION['messages'], "Bio update successful");
    }

    if (isset($_POST['img'])) {
        $target_dir = "assets/profiles/";

        $file_name = $_FILES['image']['name'];
        $file_size = $_FILES['image']['size'];
        $file_tmp  = $_FILES['image']['tmp_name'];
        $file_type = $_FILES['image']['type'];
        
        $tmp = explode('.',$_FILES['image']['name']);
        $file_ext  = strtolower(end($tmp));

        $extensions= array("jpeg","jpg","png");

        if ($file_size > 1000000) {
            throw new Exception('Sorry, your file is too large.');
        } 

        if(!in_array($file_ext,$extensions)) {
            throw new Exception('Sorry, only JPG, JPEG, PNG & GIF files are allowed.');
        }
        
        if (!move_uploaded_file($file_tmp, "assets/profiles/".$username)) {
            throw new Exception('Sorry, there was an error uploading your file.');
        }
        array_push($_SESSION['messages'], "The file ". $file_name. " has been uploaded.");
    }

} catch (Exception $e) {
    array_push($_SESSION['messages'], $e->getMessage());
}

try {
    $sql = 'SELECT bio, email FROM 186048_user WHERE username=\'' . $username . '\';';

    $bio = '';

    $res = $conn->query($sql);

    if ($res->num_rows > 0) {
        $user = $res->fetch_assoc();
        $bio = $user['bio'];
        $email = $user['email'];
    } else {
        throw new Exception('No results from database');
    }

    $sql = "SELECT COUNT(*) as total FROM 186048_follow WHERE follow='$username';";
    $res = $conn->query($sql);
    $followers = mysqli_fetch_assoc($res)['total'];

    $sql = "SELECT COUNT(*) as total FROM 186048_follow WHERE user='$username';";
    $res = $conn->query($sql);
    $following = mysqli_fetch_assoc($res)['total'];

    $sql = "SELECT COUNT(*) as total FROM 186048_retweet WHERE user='$username';";
    $res = $conn->query($sql);
    $retweets = mysqli_fetch_assoc($res)['total'];

} catch (Exception $e) {
    array_push($_SESSION['messages'], $e->getMessage());
}

// IMAGE LOAD AND BIO UPDATE
?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>MegaTwitter</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Fun Fulks Always Here!" />
    <link rel="stylesheet" href="assets/bootstrap/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="assets/css.css" />
    <link href="assets/fontawesome/all.css" rel="stylesheet" />
    <link rel="icon" type="image/ico" href="assets/favicon.ico" />
  </head>

  <body>
        <div class="controls" >
            <a id="show-sidebar" class="btn btn-sm home-btn" style="color: #000; margin: 3px;"><i class="fas fa-bars"></i></a>
        </div>
        
            <div class="page-wrapper chiller-theme" style="float: left">
                <nav id="sidebar" class="sidebar-wrapper">
                    <div class="sidebar-content">
                        <div class="sidebar-brand">
                            <a class="unselectable" href="profile.php">
                                <img
                                src="assets/profiles/<?php if (file_exists('assets/profiles/'.$username)) { echo $username;} else {echo 'default';} ?>"
                                class="rounded-img"
                                width="60px"
                                height="60px"
                              /> <?php echo $username ?>
                            </a>
                            <div id="close-sidebar">
                                <i class="fas fa-times"></i>
                            </div>
                        </div>
                        <div class="sidebar-search">
                            <div class="autocomplete">
                                <div class="input-group">
                                    <input id="search" type="text" autocomplete="off" class="form-control search-menu search"
                                        placeholder="Search...">
                                    <div class="input-group-append">
                                        <span class="input-group-text">
                                            <i class="fa fa-search" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- sidebar-search  -->
                        <div class="sidebar-menu">
                            <ul>
                                <li class="header-menu">
                                    <span></span>
                                </li>

                                <li>
                                    <a href="profile.php">
                                        <i class="fa fa-user"></i>
                                        <span>Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="index.php">
                                        <i class="fa fa-home"></i>
                                        <span>Feed</span>
                                    </a>
                                </li>
        
                                <li>
                                    <a href="following.php">
                                        <i class="fa fa-binoculars"></i>
                                        <span>Followings</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="top_tweets.php">
                                        <i class="fa fa-star"></i>
                                        <span>Top Tweets</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="logout.php">
                                        <i class="fa fa-power-off"></i>
                                        <span>Logout</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <!-- sidebar-menu  -->
                    </div>
                    <div class="sidebar-footer">
                        <a href="#">
                            <i class="fa fa-envelope"></i>
                        </a>
                        <a>
                            <i style="-moz-user-select: none;" >All rights Reserved</i>
                        </a>
                        <a>
                        <i class="fa fa-cog"></i>
                        <span class="badge-sonar"></span>
                        </a>
                    </div>
                </nav>
            </div>
        
            <div class="sheet-container theme-dark">
                    <div class="sheet-wrapper">
                            <div class="sheet">
                                <div class="titles">
                                    <div class="controls-box main-triggers">
                                        <div>
                                            <div class="change-img">
                                                <img alt="Avatar" class="rounded-img image" src="assets/profiles/<?php
                                                    if (file_exists('assets/profiles/'.$username)) { echo $username;} else {echo 'default';}
                                                ?>">
                                                <div class="middle" id="img-click">
                                                    <div class="text">Change</div>
                                                </div>
                                            </div>
                                            <p>
                                                Followers: <?php echo $followers ?>
                                            </p>
                                            <p>
                                                Following: <?php echo $following ?>
                                            </p>
                                            <p>
                                                Retweets: <?php echo $retweets ?>
                                            </p>

                                                <form method="post" enctype="multipart/form-data" style="display: none">
                                                    <input id="img-input" type="file" name="image">
                                                    <button id="img-btn" type="submit" value="Upload Image" name="img"></button>
                                                </form>
                                            </div>

                                        <span class="devider"></span>
                                        <div>
                                            <h3 id="title" class="title" style="text-decoration: underline; margin-bottom:15px" ><?php echo $username ?></h3>
                                            <div>
                                                <form method="post">
                                                    <textarea rows="3" cols="25" name="bio" placeholder="Bio"><?php echo $bio ?></textarea><br>
                                                    <button class="btn-accept" type="submit" name="bio_submit" value="Update"><i class="fa fa-paper-plane"></i></button>
                                                </form>
                                            </div>
                                            <div style="float: left;">
                                                Email: <?php echo $email ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <?php 
                                $sql = 'SELECT * FROM 186048_tweet WHERE user=\'' . $username . '\' ORDER BY created_at DESC LIMIT 3;';
                                $res = $conn->query($sql);
                                if ($res->num_rows > 0) {
                                    while ($row = $res->fetch_assoc()) {
                                        $tweet = new Tweet($row['id'], $row['text'], $row['user'], $row['created_at']);
                                        $tweet->getTweetHTML();
                                        $tweet->getComments();
                                    }
                                } else {
                                    echo "<div class='following'>
                                                <div class='titles'>
                                                    <h5 id='title' class='title'>No tweets at the moment.</h5>
                                                </div>
                                            </div>";
                                }
                            ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php echo print_messages(); ?> 
        </body>
        
        <script src="assets/bootstrap/jquery.min.js"></script>
        <script src="assets/bootstrap/bootstrap.min.js"></script>
        <script src="assets/bootstrap/popper.min.js"></script>
        <script src="assets/setup.js"></script>
        <script src="assets/fileUpload.js"></script>
</html>