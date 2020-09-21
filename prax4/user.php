<?php
require 'init.php';

try {
    if (!isset($_GET["u"])) {
        throw new Exception('User not found');
    }

    $user = mysqli_real_escape_string($conn, $_GET['u']);

    if ($user === $username) {
        throw new Exception('Its you?!');
    }

    $sql = 'SELECT bio FROM 186048_user WHERE username=\'' . $user . '\';';

    $bio = '';
    $res = $conn->query($sql);

    if ($res->num_rows > 0) {
        $data = $res->fetch_assoc();
        $bio = $data['bio'];
    } else {
        throw new Exception('No results from database');
    }
    
    $sql = "SELECT user FROM 186048_follow WHERE follow='$user';";
    $res = $conn->query($sql);

    $followers = $res->num_rows;
    $is_following = false;

    if ($res->num_rows > 0) {
        while ($row = $res->fetch_assoc()) {
            if ($row['user'] === $username) {
                $is_following = true;
            }
        }
    }

    $sql = "SELECT COUNT(*) as total FROM 186048_retweet WHERE user='$user';";
    $res = $conn->query($sql);
    $following = mysqli_fetch_assoc($res)['total'];

    $sql = "SELECT COUNT(*) as total FROM 186048_retweet WHERE user='$user';";
    $res = $conn->query($sql);
    $retweets = mysqli_fetch_assoc($res)['total'];

} catch (Exception $e) {
    array_push($_SESSION['messages'], $e->getMessage());
    header('Location: profile.php');
}
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
                                                    if (file_exists('assets/profiles/'.$user)) { echo $user;} else {echo 'default';}
                                                ?>">
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
                                        </div>
                                        <span class="devider"></span>
                                        <div>
                                            <h3 id="title" class="title" style="text-decoration: underline; margin-bottom:15px" ><?php echo $user ?></h3>
                                            <div>
                                                <div style="max-width: 260px; margin-bottom: 10px" >
                                                    <?php echo $bio ?>
                                                </div>
                                                <?php echo "<form action='follow.php?id=$user' method='post'>
                                                        <button class='btn-accept"; 
                                                        if($is_following) { echo ' active'; }
                                                        echo "' type='submit' name='follow' value='Follow'><i class='fa fa-binoculars'>";
                                                
                                                        if ($is_following) { echo 'Unfollow';} else { echo 'Follow';}
                                                    echo "</i></button>
                                                    </form>"; ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <?php 
                                $sql = 'SELECT * FROM 186048_tweet WHERE user=\'' . $user . '\' ORDER BY created_at DESC;';
                                $res = $conn->query($sql);
                                if ($res->num_rows > 0) {
                                    while ($row = $res->fetch_assoc()) {
                                        $tweet = new Tweet($row['id'], $row['text'], $row['user'], $row['created_at']);
                                        $tweet->getTweetHTML();
                                        $tweet->getComments();
                                    }
                                } else {
                                    echo "<div class='tweet'>
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
</html>