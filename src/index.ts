import express from 'express';
//import { createClient } from 'redis';

const app = express();
const PORT = 3000;

//const redis = createClient();
//await redis.connect();

const queue: any[] = [];

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server running at port ${PORT}`);
});

app.get("/", (req, res) => {
	res.json({ message: "Szia, dyza!" });
});

app.post("/webhook", async (req, res) => {
	//await ingest(req.body);
	const payload = req.body;
	await enqueue(payload);
	res.json({ 
		received: true, 
		message: "received webhook data, thanks!" 
	});
});

app.get("/process", (req, res) => {
	const item = dequeue();
	res.json(item);
});

function dequeue() {
	if (!queue.length) {
		console.warn("queue is empty");
		return null;
	}
	const item = queue.shift();
	console.log(`popped: ${JSON.stringify(item)}`);
	return item;
}

async function enqueue(payload: any) {
	queue.push(payload);
	console.log(`queued ${JSON.stringify(payload)}`);
}

/*
async function ingest(body) {
	await redis.lPush('webhook_queue', JSON.stringify(body));
}
*/

