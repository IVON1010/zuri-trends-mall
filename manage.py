import click
from server.app.app import create_app

app = create_app()

@app.cli.command('seed')
@click.argument('type', default='all')
def seed(type):
    """Seed the database."""
    from seed import seed_all
    
    if type == 'all':
        seed_all()
    else:
        click.echo(f"Unknown seed type: {type}")

@app.cli.command('show-routes')
def show_routes():
    """Show all registered routes."""
    for rule in app.url_map.iter_rules():
        methods = ','.join(rule.methods)
        print(f"{rule.endpoint:30s} {methods:20s} {rule}")
