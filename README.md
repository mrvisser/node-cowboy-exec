# node-cowboy-exec

[![Build Status](https://travis-ci.org/mrvisser/node-cowboy-exec.png?branch=master)](https://travis-ci.org/mrvisser/node-cowboy-exec)

Cowboy module that allows you to execute arbitrary shell commands on cattle nodes

## Installation

```
$ cowboy install cowboy-exec
```

## Usage

### Help

```
$ cowboy exec --help

Execute an arbitrary shell command on the cattle nodes

cowboy exec -- -c "command to execute"

Example use:

cowboy exec -- -c "ls /etc/cowboy"
cowboy exec -- -c "service redis-server restart"
```

### Example

```
$ cowboy exec -- -c 'df -h'
Executing command: "df -h"
 
Host: host_b (Success!)
========================
 
Filesystem      Size   Used  Avail Capacity  iused   ifree %iused  Mounted on
/dev/disk0s2   112Gi   93Gi   19Gi    84% 24513378 4898990   83%   /
devfs          212Ki  212Ki    0Bi   100%      734       0  100%   /dev
map -hosts       0Bi    0Bi    0Bi   100%        0       0  100%   /net
map auto_home    0Bi    0Bi    0Bi   100%        0       0  100%   /home
/dev/disk2s2   900Mi  900Mi    0Bi   100%   460897       0  100%   /Volumes/VMware Fusion
/dev/disk1s2   7.0Mi  1.3Mi  5.6Mi    20%      340    1442   19%   /Volumes/Adobe Flash Player Installer
/dev/disk4s2   2.8Mi  2.0Mi  872Ki    70%      504     218   70%   /Volumes/Disk Inventory X 1.0 src
/dev/disk5s2    16Mi  9.8Mi  6.2Mi    62%     2503    1581   61%   /Volumes/Disk Inventory X
/dev/disk3s2    75Mi   63Mi   12Mi    84%    16124    3080   84%   /Volumes/Panda3D
/dev/disk6s2    53Mi   41Mi   12Mi    77%    10484    3145   77%   /Volumes/Cg-3.1.0013
/dev/disk7s2    69Mi   69Mi    0Bi   100%    35148       0  100%   /Volumes/Install Google Drive


Host: host_a (Success!)
========================
 
Filesystem      Size   Used  Avail Capacity  iused   ifree %iused  Mounted on
/dev/disk0s2   112Gi   93Gi   19Gi    84% 24513378 4898990   83%   /
devfs          212Ki  212Ki    0Bi   100%      734       0  100%   /dev
map -hosts       0Bi    0Bi    0Bi   100%        0       0  100%   /net
map auto_home    0Bi    0Bi    0Bi   100%        0       0  100%   /home
/dev/disk2s2   900Mi  900Mi    0Bi   100%   460897       0  100%   /Volumes/VMware Fusion
/dev/disk1s2   7.0Mi  1.3Mi  5.6Mi    20%      340    1442   19%   /Volumes/Adobe Flash Player Installer
/dev/disk4s2   2.8Mi  2.0Mi  872Ki    70%      504     218   70%   /Volumes/Disk Inventory X 1.0 src
/dev/disk5s2    16Mi  9.8Mi  6.2Mi    62%     2503    1581   61%   /Volumes/Disk Inventory X
/dev/disk3s2    75Mi   63Mi   12Mi    84%    16124    3080   84%   /Volumes/Panda3D
/dev/disk6s2    53Mi   41Mi   12Mi    77%    10484    3145   77%   /Volumes/Cg-3.1.0013
/dev/disk7s2    69Mi   69Mi    0Bi   100%    35148       0  100%   /Volumes/Install Google Drive
```

## License

Copyright (c) 2013 Branden Visser

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
