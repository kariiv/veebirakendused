<?php
require 'init.php';

try {
    if (isset($_POST['submit'])) {
        if (isset($_POST['username']) && isset($_POST['password'])) {

            $username = mysqli_real_escape_string($conn, $_POST['username']);
            $password = mysqli_real_escape_string($conn, $_POST['password']);

            $sql = "SELECT password FROM 186048_user WHERE username='$username' ";
            
            $check = $conn->query($sql);
            $rows = mysqli_fetch_array($check);

            if (!$rows) {
                throw new Exception('User not found');
            }
            $pass = $rows["password"];

            if (!password_verify($password, $pass)) {
                throw new Exception('Invalid password!');
            }

            array_push($_SESSION['messages'], "Login successful");
            $_SESSION['username'] = $username;
            header("Location: index.php");
        }
    }
} catch (Exception $e) {
    array_push($_SESSION['messages'], $e->getMessage());
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
        <div class="sheet-container theme-dark">
            <div class="sheet-wrapper">
                <div class="sheet">
                    <a href="register.php" style="float: right; margin-left: 5px"><i class="fa fa-user-plus"> Register</i></a>
                    <form method="post">
                        <div class="titles">
                            <h3 class="artist" style="padding: 3px" >Login</h3>
                            <h5 class="artist"><input class="title text-title" name="username" style="float: none;" placeholder="Username" type="text" required></h5>
                            <h5 class="artist"><input class="title text-title" name="password" style="float: none;" placeholder="Password" type="password" required></h5>
                        </div>

                        <div class="main-triggers"><button class="btn-accept" 
                            type="submit" name="submit">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <?php echo print_messages();?> 
</body>
    <script src="assets/bootstrap/jquery.min.js"></script>
    <script src="assets/bootstrap/bootstrap.min.js"></script>
    <script src="assets/bootstrap/popper.min.js"></script> 
</html>
