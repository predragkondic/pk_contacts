<?php

require_once realpath("../vendor/autoload.php");
require_once realpath("../src/data/helper.php");

$contacts = getContacts();
$i = 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="assets/extern/bootstrap/bootstrap.css" />
    <link rel="stylesheet" href="assets/extern/datatables/datatables.min.css" />
    <link rel="stylesheet" href="assets/css/main.css" />
    <script src="assets/extern/jquery/jquery.min.js" type="application/javascript"></script>
    <script src="assets/extern/datatables/datatables.min.js" type="application/javascript"></script>
    <title>Variussystems Contacts</title>
</head>
    <body>
            <table id="contacts" class="table table-striped table-bordered" style="width:100%">
                <thead>
                    <tr>
                        <th>Anrede</th>
                        <th>Titel</th>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>E-Mail</th>
                        <th>Telefon</th>
                        <th>Anschrift</th>
                        <th>PLZ</th>
                        <th>Stadt</th>
                        <th>Land</th>
                    </tr>
                </thead>
                <tbody>
        <?php
            foreach ($contacts as $contact) {
                $i++;
                echo '<tr class="'.($i % 2 != 0 ? "odd" : "even") .'">
                        <td>'.$contact["gender"].'</td>
                        <td>'.$contact["title"].'</td>
                        <td>'.$contact["name"].'</td>
                        <td>'.$contact["lastname"].'</td>
                        <td>'.$contact["email"].'</td>
                        <td>'.$contact["phone"].'</td>
                        <td>'.$contact["address_street"].'</td>
                        <td>'.$contact["address_postalcode"].'</td>
                        <td>'.$contact["address_city"].'</td>
                        <td>'.locale_get_display_region('sl-Latn-'.$contact["address_country"].'-nedis', 'de').'</td>
                      </tr>';
            }
        ?>
                </tbody>
            </table>
    <script>
        $(document).ready(function() {
            $('#contacts').DataTable({
                // ajax: '/api/staff',
                dom: 'Bfrtip',
                select: true,
                buttons: [
                    { extend: 'create', editor: editor },
                    { extend: 'edit',   editor: editor },
                    { extend: 'remove', editor: editor }
                ]
            });
        } );

        var editor = new $.fn.dataTable.Editor( {
            // ...
        } );
    </script>
    </body>
</html>
