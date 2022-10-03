export async function loadLocalFile() {
  let url = 'http://react/react-3d-plan/php/loadLocal.php';

  let response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });

  let inf = await response.json();

  console.log(inf);

  return true;
}
