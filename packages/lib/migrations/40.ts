import JoplinDatabase from '../JoplinDatabase';
import { MigrationScript } from '../models/Migration';
import Setting from '../models/Setting';
import { SyncTargetInfo } from '../services/synchronizer/syncTargetInfoUtils';

const script: MigrationScript = {

	exec: async function(db: JoplinDatabase): Promise<void> {
		const masterKeys = await db.selectAll('SELECT * FROM master_keys');

		const masterKeyMap: Record<string, any> = {};
		for (const mk of masterKeys) masterKeyMap[mk.id] = mk;

		const syncInfo: SyncTargetInfo = {
			version: 2,
			e2ee: Setting.valueNoThrow('encryption.enabled', false),
			masterKeys: masterKeyMap,
			activeMasterKeyId: Setting.valueNoThrow('encryption.activeMasterKeyId', ''),
			updatedTime: Date.now(),
		};

		Setting.setValue('sync.info', JSON.stringify(syncInfo));
	},

};

export default script;