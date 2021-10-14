<?php
use Variussystems\DotEnv;
(new DotEnv('../.env'))->load();

function databaseConnect() {
    try {
        $dbConnection = new PDO("mysql:host=".getenv("DB_HOST").";dbname=".getenv("DB_NAME"), getenv("DB_USER"), getenv("DB_PASSWORD"));
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbConnection;
    } catch(PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
    }
}

function getContacts() {
    $dbConnection = databaseConnect();
    $sql = 'SELECT * FROM contacts';
    try {
        $contacts = $dbConnection->query($sql);
        $contactsData = $contacts->fetchAll();
    } catch(PDOException $e) {
        die("Could not load contacts");
    }
    return $contactsData;
}
