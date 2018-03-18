<?php
/*if (isset($_POST['Json'])) {
    $Json = $_POST['Json'];
    $fd = fopen("init.json", "w");
    fwrite($fd, $Json);
    fclose($fd);
    echo $Json;
} else {*/


$Json = $_POST['Json'];
$fd = fopen($Json, "r");
$texto="";

while (!feof($fd)) {
    $linea = fgets($fd);

    $texto .= $linea;
}

fclose($fd);

echo $texto;

?>