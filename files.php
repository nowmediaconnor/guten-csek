<?php
/*
 * Created on Sat Sep 30 2023
 * Author: Connor Doman
 */

function find_files_recursively($dir, $recursive = true, $found_files = []): array
{
    if (is_dir($dir)) {

        $files = scandir($dir);
        $dirs = [];

        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            $full_path = $dir . DIRECTORY_SEPARATOR . $file;

            if (is_dir($full_path)) {
                $dirs[] = $full_path;
            } else {
                // echo "Found file: " . $full_path . "<br/>";
                $found_files[] = $full_path;
            }
        }

        if ($recursive) {
            foreach ($dirs as $dir) {
                $found_files = find_files_recursively($dir, $recursive, $found_files);
            }
        }
        return $found_files;
    }
    return [$dir];
}

function get_all_files_from_dir($dir, $recursive = false): array
{
    return find_files_recursively($dir, $recursive);
}
