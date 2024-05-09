import { world, system } from '@minecraft/server';

const replaceList = {'water_bucket' : 'water',
				'lava_bucket' : 'lava',
				'powder_snow_bucket' : 'powder_snow',
				'bucket' : 'air'}

world.afterEvents.itemUse.subscribe(event=>{
	switch(event.itemStack.typeId){
		case "minecraft:splash_potion" :
			paint(event.source, event.itemStack.typeId, 0);
			break;
	}
});
world.afterEvents.itemUseOn.subscribe(event=>{
	switch(event.itemStack.typeId){
		case "minecraft:brush" ://fall
		case "minecraft:squid_spawn_egg" :
			paint(event.source, event.itemStack.typeId, event.block);
			break;
	}
});
world.afterEvents.projectileHitBlock.subscribe(event=>{
	switch(event.projectile.typeId){
		case "minecraft:snowball" :
			paint(event.source, event.projectile.typeId, event.getBlockHit().block);
			break;
	}
});
function paint(player, useItem, block){
	let hotSlot0 = player.getComponent("minecraft:inventory").container.getItem(0);
	hotSlot0 = (hotSlot0 ? hotSlot0.typeId : 0);
	let hotSlot1 = player.getComponent("minecraft:inventory").container.getItem(1);
	hotSlot1 = (hotSlot1 ? hotSlot1.typeId : 0);
	
	if(hotSlot0 && hotSlot1 && player.hasTag("paint")){
		for (const [key, value] of Object.entries(replaceList)) {
			hotSlot0 = hotSlot0.replace(key, value);
			hotSlot1 = hotSlot1.replace(key, value);
		}
		switch(useItem){
			case "minecraft:splash_potion" :
				player.runCommand("fill ~2 ~2 ~2 ~-2 ~-2 ~-2 " + hotSlot0 + " [] replace " + hotSlot1 + " []");//cube around player
				system.runTimeout(() => {
					player.runCommand("kill @e [r=10, type=splash_potion]");
				}, 1);
				break;
			case "minecraft:squid_spawn_egg" :
				player.runCommand("execute positioned " + block.x + " " + block.y + " " + block.z + " run fill ~2 ~2 ~2 ~-2 ~-2 ~-2 " + hotSlot0 + " [] replace " + hotSlot1 + " []");//squid spawn egg
				system.runTimeout(() => {
					player.runCommand("execute positioned " + block.x + " " + block.y + " " + block.z + " run kill @e [r=5, type=squid]");
				}, 1);
				system.runTimeout(() => {
					player.runCommand("execute positioned " + block.x + " " + block.y + " " + block.z + " run kill @e [r=5, name=\"ink sac\"]");
				}, 2);
				break;
			case "minecraft:snowball" :
				player.runCommand("execute positioned " + block.x + " " + block.y + " " + block.z + " run fill ~2 ~2 ~2 ~-2 ~-2 ~-2 " + hotSlot0 + " [] replace " + hotSlot1 + " []");//snowball
				break;
			case "minecraft:brush" :
				player.runCommand("fill " + block.x + " " + block.y + " " + block.z + " " + block.x + " " + block.y + " " + block.z + " " + hotSlot0 + " [] replace " + hotSlot1 + " []");//brush
				break;
		}
	}
}