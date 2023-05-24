import wifi from 'node-wifi';
import cron from 'node-cron';
import { JsonDB, Config } from 'node-json-db';



const db = new JsonDB(new Config("ssid-2023-05-19", true, false, '/'));



wifi.init({
  iface: null // network interface, choose a random wifi interface if set to null
});

cron.schedule('*/5 * * * * *', async () => {
  // console.log('running a task every 3 seconds');

  const alreadySaved = await db.getData("/list") || {
    content: []
  };

  // Scan networks
  wifi.scan((error, networks) => {
    if (error) {
      console.log(error);
    } else {
      // console.log(networks);
      let currentList = [
        ...alreadySaved.content,
      ];

      networks.forEach((wifi) => {
        const findItem = currentList.find(item => item.ssid === wifi.ssid);
        // console.log('findItem', findItem);

        if(findItem === undefined) {
          currentList.push({
            ssid: wifi.ssid,
          });
          console.log('new ssid name: ' + wifi.ssid);
        }
      });

      db.push("/list", {
        content: currentList
      });
    }
  });
});
