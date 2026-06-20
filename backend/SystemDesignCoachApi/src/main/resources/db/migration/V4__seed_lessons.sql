INSERT INTO lessons
(
    topic_id,
    title,
    slug,
    summary,
    content,
    estimated_minutes,
    display_order
)
VALUES
    (
        (
            SELECT id
            FROM topics
            WHERE slug = 'load-balancing'
        ),
        'Load Balancing Fundamentals',
        'load-balancing-fundamentals',
        'Understand why systems distribute requests across multiple servers.',
        $lesson$
            # Load Balancing Fundamentals

A load balancer sits between users and application servers.

Instead of sending every request to one server, it distributes requests across several servers.

## Why it is needed

Without a load balancer:

- One server receives all traffic
- That server can become overloaded
- Its failure can make the application unavailable

## Common strategies

### Round Robin

Requests are distributed one after another:

Server A → Server B → Server C → Server A

### Least Connections

The request is sent to the server currently handling the fewest active connections.

### Weighted Distribution

More powerful servers receive more traffic than weaker servers.

## Example

For a chat application:

Client → Load Balancer → Multiple Chat Servers

The load balancer prevents one chat server from handling every user.
$lesson$,
        8,
        1
    ),
    (
        (
            SELECT id
            FROM topics
            WHERE slug = 'caching'
        ),
        'Caching Fundamentals',
        'caching-fundamentals',
        'Understand how caching reduces latency and database workload.',
        $lesson$
            # Caching Fundamentals

A cache stores frequently requested information in fast storage.

Instead of repeatedly asking the database for the same information, the application checks the cache first.

## Request flow

1. Application checks the cache
2. Cached value exists: return it
3. Cached value does not exist: query the database
4. Store the database result in the cache
5. Return the result

## Benefits

- Faster responses
- Lower database load
- Better scalability

## Main difficulty

Cached information can become outdated.

This creates the cache invalidation problem.
$lesson$,
        8,
        1
    ),
    (
        (
            SELECT id
            FROM topics
            WHERE slug = 'content-delivery-networks'
        ),
        'CDN Fundamentals',
        'cdn-fundamentals',
        'Learn how CDNs deliver content from locations closer to users.',
        $lesson$
            # CDN Fundamentals

A Content Delivery Network stores copies of content at locations around the world.

These locations are called edge servers.

## Example

A user in India should not always download an image from a server in the United States.

A CDN can serve the image from a nearby Asian edge location.

## Best uses

- Images
- Videos
- JavaScript files
- CSS files
- Downloadable content

## Benefits

- Lower latency
- Reduced origin-server traffic
- Better global performance
$lesson$,
        7,
        1
    ),
    (
        (
            SELECT id
            FROM topics
            WHERE slug = 'message-queues'
        ),
        'Message Queue Fundamentals',
        'message-queue-fundamentals',
        'Understand asynchronous communication using producers and consumers.',
        $lesson$
            # Message Queue Fundamentals

A message queue allows one service to send work without waiting for another service to complete it immediately.

## Main components

- Producer: sends a message
- Queue: stores the message
- Consumer: processes the message

## Example

After an order is placed:

1. Order service saves the order
2. Order service publishes an event
3. Email service sends confirmation
4. Inventory service updates stock

The order service does not need to wait for every operation.

## Benefits

- Loose coupling
- Failure isolation
- Traffic buffering
- Asynchronous processing
$lesson$,
        10,
        1
    ),
    (
        (
            SELECT id
            FROM topics
            WHERE slug = 'database-replication'
        ),
        'Database Replication Fundamentals',
        'database-replication-fundamentals',
        'Learn how database copies improve availability and read performance.',
        $lesson$
            # Database Replication Fundamentals

Replication means maintaining copies of database data on multiple database servers.

## Primary-replica architecture

- The primary database accepts writes
- Replica databases copy changes from the primary
- Read requests may be served by replicas

## Benefits

- Better read scalability
- Backup database copies
- Improved availability

## Important problem

Replication may have delay.

A user may update information and briefly receive old data from a replica. This is called replication lag.
$lesson$,
        10,
        1
    ),
    (
        (
            SELECT id
            FROM topics
            WHERE slug = 'database-sharding'
        ),
        'Database Sharding Fundamentals',
        'database-sharding-fundamentals',
        'Understand how large datasets are divided between database servers.',
        $lesson$
            # Database Sharding Fundamentals

Sharding divides a large dataset across multiple database servers.

Each server stores only part of the complete dataset.

## Example

Users may be divided using user ID:

- Shard 1: users 1 to 1,000,000
            - Shard 2: users 1,000,001 to 2,000,000
            - Shard 3: users 2,000,001 to 3,000,000

            ## Benefits

- More storage capacity
- Distributed database workload
- Horizontal scalability

## Difficulties

- Choosing a good shard key
- Moving data between shards
- Cross-shard queries
- Uneven data distribution
$lesson$,
        12,
        1
    );