package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.capability.BatchCountingStatement;
import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.capability.TableBase;
import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
import legacy.health.genomics.vcf.parser.utils.SQLUtils;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by D058991 on 24.02.2018.
 */
public class SNVVariantMV extends TableBase<VCFDataField> {

	protected List<String> sqlColumnNames;
	private static final Logger LOGGER = LoggerFactory.getLogger(SNVVariantMV.class);

	enum STATIC_FIELDS {
		DWAuditID(1), VariantIndex(2), ValueIndex(3);

		private final int idx;

		STATIC_FIELDS(int idx) {
			this.idx = idx;
		}

		int getIdx() {
			return idx;
		}
	}

	public SNVVariantMV(VCFStructureDefinition vcfFileDefintion, Connection conn, ImportConfiguration context)
			throws SQLException, EnvironmentException {
		super("hc.hph.genomics.db.models::SNV.VariantMultiValueAttributes", conn, context);
		getFields().add(new LinkedList<>());
		for (InfoField f : vcfFileDefintion.getInfo().values()) {
			if (!"01AR".contains(f.getNumber())) {
				getFields().get(0).add(f);
			}
		}
		sqlColumnNames = new ArrayList<>(3);
		for (STATIC_FIELDS x : STATIC_FIELDS.values()) {
			sqlColumnNames.add(x.getIdx() - 1, x.name());
		}

	}

	public void init() throws SQLException, EnvironmentException {
		setInsertStmt(createPreparedInsertStmt(super.getSchemaName(), getTableName(), sqlColumnNames));
	}

	@Override
	public void consumeDataRow(Dataline line) throws SQLException, DatalineParseException {
		getInsertStmt().clearParameters();

		int maxValueCount = 0;
		for (VCFDataField f : getFields().get(0)) {
			InfoField info = (InfoField) f;
			DatalineInfoField datalineInfoField = line.getInfo().get(info.getId());
			if (datalineInfoField != null) {
				maxValueCount = Math.max(maxValueCount, datalineInfoField.getValues().size());
				try {
					if (!info.getNumber().equals(".")) {
						int count = Integer.parseInt(info.getNumber());
						if (datalineInfoField.getValues().size() > count) {
							throw new DatalineParseException("Too many values for info field: " + info.getId()
									+ " expexted " + info.getNumber() + " got " + datalineInfoField.getValues().size());
						}
					}
				} catch (NumberFormatException e) {
					LOGGER.debug(ExceptionUtils.getStackTrace(e));
					throw new DatalineParseException("Not a valid number for: " + info.getId());
				}
			}
		}

		for (int currentValueIndex = 0; currentValueIndex < maxValueCount; ++currentValueIndex) {

			getInsertStmt().setInt(STATIC_FIELDS.DWAuditID.getIdx(), getConfig().getDwid());
			getInsertStmt().setInt(STATIC_FIELDS.VariantIndex.getIdx(), line.getSourceLine());
			getInsertStmt().setInt(STATIC_FIELDS.ValueIndex.getIdx(), currentValueIndex);
			int index = STATIC_FIELDS.values().length + 1;
			for (VCFDataField f : getFields().get(0)) {
				InfoField info = (InfoField) f;
				DatalineInfoField datalineInfoField = null;
				if (line.getInfo().containsKey(info.getId())) {
					datalineInfoField = line.getInfo().get(info.getId());
				}
				if (datalineInfoField == null || datalineInfoField.getValues() == null
						|| datalineInfoField.getValues().size() <= currentValueIndex) {
					SQLUtils.addValueWithCorrectType(getInsertStmt(), index, null, info.getType());
				} else {
					SQLUtils.addValueWithCorrectType(getInsertStmt(), index,
							datalineInfoField.getValues().get(currentValueIndex), info.getType());
				}
				++index;
			}
			getInsertStmt().addBatch();
		}

		if (((BatchCountingStatement) getInsertStmt()).getBatchCount() > getConfig().getBatchSize()) {
			getInsertStmt().executeBatch();
			getConnection().commit();
			getInsertStmt().clearBatch();
		}

	}

	@Override
	public int getStaticFieldSize() {
		return STATIC_FIELDS.values().length;
	}
}
