<?php
require 'init.php';

try {
    if (isset($_POST['submit'])) {
        if (isset($_POST['username']) && isset($_POST['password1']) && isset($_POST['email'])) {
            $p1 = $_POST['password1'];

            $username = mysqli_real_escape_string($conn, $_POST['username']);
            $email = mysqli_real_escape_string($conn, $_POST['email']);
            $password = mysqli_real_escape_string($conn, $p1);
            $hashed = password_hash($password, PASSWORD_BCRYPT);

            if (!preg_match("/^[a-zA-Z0-9]*$/",$_POST['username'])) {
                throw new Exception('Only letters and numbers are allowed in username');
            }

            if (strlen($_POST['username']) < 4) {
                throw new Exception('Username too short');
            }

            if (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
                throw new Exception('Invalid email format');
            }

            if ($p1 !== $_POST['password2']) {
                throw new Exception('Passwords dont match');
            }

            $sql = "SELECT COUNT(*) as total FROM 186048_user WHERE username='$username';";
            $check = $conn->query($sql);
            $data = mysqli_fetch_assoc($check);

            if ((int) $data['total'] > 0) {
                throw new Exception('User already exist');
            }

            $sql = 'INSERT INTO 186048_user (username, password, email) VALUES (\'' . $username . '\', \'' . $hashed . '\', \'' . $email . '\')';
            $res = $conn->query($sql);

            if (!$res) {
                throw new Exception('Mysql error: ');
            }

            array_push($_SESSION['messages'], "Account created");
            $_SESSION['username'] = $username;
            array_push($_SESSION['messages'], "Login successful");

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
                    <a href="login.php" style="float: right; margin-left: 5px"><i class="fa fa-sign-in-alt"> Login</i></a>
                    <form method="post">
                        <div class="titles">
                            <h3 class="artist" style="padding: 3px">Register</h3>
                            <h5 class="artist"><input class="title text-title" name="username" style="float: none;" placeholder="Username" type="text" required></h5>
                            <h5 class="artist"><input class="title text-title" name="email" style="float: none;" placeholder="Email" type="text" required></h5>
                            <h5 class="artist"><input class="title text-title" name="password1" style="float: none;" placeholder="Password" type="password" required></h5>
                            <h5 class="artist"><input class="title text-title" name="password2" style="float: none;" placeholder="Repeat password" type="password" required></h5>
                        </div>

                        <div>
                            <p id="lyrics" class="lyrics"><div class="main-triggers"><button class="btn-accept" type="submit" name="submit">Register</button></div></p>
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
