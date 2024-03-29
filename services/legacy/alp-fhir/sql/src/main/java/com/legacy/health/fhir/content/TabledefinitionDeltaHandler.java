package com.legacy.health.fhir.content;

import java.util.ArrayList;
import java.util.List;

import com.legacy.health.fhir.content.model.Tabledefinition;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.SQLDataType;
import com.legacy.health.fhir.meta.sql.Table;
import com.legacy.health.fhir.meta.sql.queryengine.SQLUtils;

public class TabledefinitionDeltaHandler {

	public List<Delta> getDeltas(Tabledefinition target, Tabledefinition source) {
		List<Delta> ret = new ArrayList<Delta>();
		if (!target.getUrl().equals(source.getUrl())) {
			ret.add(this.incompatibleDelta(target,
					"Not supported update: source and target must have same canonical ID"));
			return ret;
		}
		if (!target.isView() && source.isView()) {
			ret.add(this.incompatibleDelta(target, "Not supported update: from view to table"));
		}
		if (target.isView() && !source.isView()) {
			ret.add(this.incompatibleDelta(target, "Not supported update: from table to view"));
		}
		if (!target.isView()) {
			String targetFullTableName = target.getFullTableName();
			String sourceFullTableName = source.getFullTableName();
			if (!targetFullTableName.equals(sourceFullTableName)) {
				ret.add(this.incompatibleDelta(target, "Not supported update: Change of Table Name"));
			}
			Table targetTable = target.getTableModel();
			Table sourceTable = source.getTableModel();
			String sourceDDL = sourceTable.getDDL();
			String targetDDL = targetTable.getDDL();
			if (targetDDL.equals(sourceDDL)) {
				return ret;
			}
			List<DataElement> lde = target.getDataElements();
			for (DataElement tde : lde) {
				Column tc = targetTable.getColumnByName(SQLUtils.ensureQuoting(tde.getShortName(), '"'));
				DataElement sde = source.getDataElement(tde.getId());
				if (sde == null) {
					ret.add(this.additionalColum(target, tc));
				} else {
					SQLDataType tdt = (SQLDataType) tde.getType();
					SQLDataType sdt = (SQLDataType) sde.getType();
					if (!tdt.getId().equals(sdt.getId())) {
						ret.add(this.changeColumType(target, tc));
					}
					if (tdt.precission() != null && sdt.precission() == null) {
						ret.add(this.changeColumPrecission(target, tc));
					}
					if (tdt.precission() != null && !tdt.precission().equals(sdt.precission())) {
						ret.add(this.changeColumPrecission(target, tc));
					}
					if (tdt.scale() != null && sdt.scale() == null) {
						ret.add(this.changeColumScale(target, tc));
					}
					if (tdt.scale() != null && !tdt.scale().equals(sdt.scale())) {
						ret.add(this.changeColumScale(target, tc));
					}

				}
			}

		}
		return ret;
	}

	protected Delta incompatibleDelta(Tabledefinition td, String message) {
		IncompatibleDelta ret = new IncompatibleDelta();
		ret.message = message;
		ret.td = td;
		ret.isCompatible = false;
		return ret;
	}

	protected Delta additionalColum(Tabledefinition td, Column column) {
		AddColumnDelta ret = new AddColumnDelta();
		ret.message = "New column:" + column.getName();
		ret.isCompatible = true;
		ret.td = td;
		ret.modifiedColumn = column;
		return ret;
	}

	protected Delta changeColumType(Tabledefinition td, Column column) {
		ChangeColumnType ret = new ChangeColumnType();
		ret.isCompatible = false;
		ret.message = (!ret.isCompatible ? "Incompatible Change:" : "") + "Change column type:" + column.getName();
		ret.td = td;
		ret.modifiedColumn = column;
		return ret;
	}

	protected Delta changeColumPrecission(Tabledefinition td, Column column) {
		ChangeColumnPrecission ret = new ChangeColumnPrecission();
		ret.isCompatible = false;
		ret.message = (!ret.isCompatible ? "Incompatible Change:" : "") + "Change column type:" + column.getName();
		ret.td = td;
		ret.modifiedColumn = column;
		return ret;
	}

	protected Delta changeColumScale(Tabledefinition td, Column column) {
		ChangeColumnPrecission ret = new ChangeColumnPrecission();
		ret.isCompatible = false;
		ret.message = (!ret.isCompatible ? "Incompatible Change:" : "") + "Change column type:" + column.getName();
		ret.td = td;
		ret.modifiedColumn = column;
		return ret;
	}

	public static class Delta {
		public Tabledefinition td;
		public Column modifiedColumn;
		public String message;
		public boolean isCompatible;
	}

	public class IncompatibleDelta extends Delta {

	}

	public class RemoveColumnDelta extends Delta {

	}

	public class AddColumnDelta extends Delta {
	}

	public class ChangeColumnPrecission extends Delta {
	}

	public class ChangeColumnSize extends Delta {
	}

	public class ChangeColumnType extends Delta {
	}

	public class AlterViewDefinition extends Delta {

	}
}
