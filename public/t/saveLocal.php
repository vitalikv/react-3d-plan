<? 




$data = $_POST['data']; 


if(1==1)
{	
	file_put_contents('file.json', $data);
}
else
{
	// Открываем файл, флаг W означает - файл открыт на запись
	$f_hdl = fopen('fileJson.json', 'w');
	// Записываем в файл $text
	fwrite($f_hdl, $data);
	// Закрывает открытый файл
	fclose($f_hdl);	
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json; charset=utf-8');
echo json_encode( $data );


