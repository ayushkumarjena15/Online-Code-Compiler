import axios from 'axios';

async function run() {
  const { data } = await axios.get('https://wandbox.org/api/list.json');
  const find = lang => data.filter(c => c.language === lang).map(c => c.name);
  console.log('Scala', find('Scala'));
  console.log('OCaml', find('OCaml'));
  console.log('Crystal', find('Crystal'));
  console.log('Erlang', find('Erlang'));
  console.log('Swift', find('Swift'));
}
run();
