<?php
if (isset($_POST['Json']) && isset($_POST['user'])) {
    $Json = $_POST['Json'];
    $user = $_POST['user'];
    $hora = time();
    $campos1 = getdate($hora);// fecha en formato normal

    $fecha = $campos1['mday'] . "-" . $campos1['mon'] . "-" . $campos1['year'] . "_" . $campos1['hours'] . "-" . $campos1['minutes'] . "-" . $campos1['seconds'];
    $nombreFich = $user . "_" . $fecha . ".json";
    $fd = fopen($nombreFich, "w");
    fwrite($fd, $Json);
    fclose($fd);
    echo $Json;
}
?>