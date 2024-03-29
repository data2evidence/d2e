package legacy.health.genomics.vcf.parser.datamodel;

/**
 * Created by D058991 on 24.02.2018.
 */
public abstract class VCFDataField implements IdentifiableField, TypedField {

    String alias;
    public abstract String getId();

    @Override
    public abstract EPrimitiveType getType();

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getAlias() {
        return alias == null ? getId() : alias;
    }
}
