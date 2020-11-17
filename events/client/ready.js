module.exports = (client) => {
  // eslint-disable-next-line no-console
  console.log(
    `${client.user.username} is online: ${new Date().toString().slice(4, 24)}`,
  );

  const activities = [
    `${client.guilds.cache.size} servers!`,
    `${client.channels.cache.size} channels!`,
    `${client.users.cache.size} users!`,
  ];
  let i = 0;
  setInterval(
    () => client.user.setActivity(
      // eslint-disable-next-line no-plusplus
      `${client.prefix}help | ${activities[i++ % activities.length]}`,
      { type: 'PLAYING' },
    ),
    15000,
  );
};
