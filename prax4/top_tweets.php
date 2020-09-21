<?php
require 'init.php';

$TOP_LIMIT = 10;
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
                            
                            <?php
                            echo "<div class='sheet'>
                                    <div class='titles'>
                                        <h2>Top $TOP_LIMIT tweets</h2>
                                    </div>
                                </div>";

                                function cmp($a, $b) {
                                    return strcmp($a->name, $b->name);
                                }
    
                                $sql = 'SELECT tweet FROM 186048_like;';
                                $res = $conn->query($sql);
                                $tweets = array();

                                if ($res->num_rows > 0) {
                                    while ($row = $res->fetch_assoc()) {
                                        array_push($tweets ,$row['tweet']);
                                    }
                                }

                                $counts = array_count_values($tweets);
                                arsort($counts);
                                
                                $bestTweets = array_slice(array_keys($counts), 0, $TOP_LIMIT);
    
                                foreach ($bestTweets as $tweet) {
                                    $sql = 'SELECT * FROM 186048_tweet WHERE id=\'' . $tweet . '\';';
                                    $res = $conn->query($sql);
                                    if ($res->num_rows > 0) {
                                        while ($row = $res->fetch_assoc()) {
                                            $tweet = new Tweet($row['id'], $row['text'], $row['user'], $row['created_at']);
                                            $tweet->getTweetHTML();
                                            $tweet->getComments();
                                        }
                                    }
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