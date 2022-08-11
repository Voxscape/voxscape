const TryApiPage: React.FC = () => {
  const onFetchServerConfig = () =>
    fetch('/api/server_config').then(async (res) => console.debug('serverConfig', await res.json()));
  const onClick = () =>
    fetch('/api/_forwarded/try-forward?segments=1,2,3&b=2&pathSegments=1', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ key: 'value' }),
    });

  return (
    <div>
      <button type="button" onClick={onFetchServerConfig}>
        GET /api/servre_config
      </button>
      <button type="button" onClick={onClick}>
        POST /api/try-forward
      </button>
    </div>
  );
};
export default TryApiPage;
