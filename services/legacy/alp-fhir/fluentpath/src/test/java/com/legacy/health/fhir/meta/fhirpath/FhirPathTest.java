package com.legacy.health.fhir.meta.fhirpath;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;
import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.fhirpath.antlr.FhirPathLexer;
import com.legacy.health.fhir.meta.fhirpath.antlr.FhirPathParser;
import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.FhirCollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.MapBasedCollectionNode;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class FhirPathTest {

	static MetaRepository repo;
	static ObjectMapper mapper = new ObjectMapper();
	static Structure structure;

	@BeforeClass
	public static void setUp() throws Exception {
		ClassLoader classLoader = FhirPathTest.class.getClassLoader();
		File zipfile = new File(classLoader.getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipfile);

		repo = RepositoryBuilder.createRepository(provider);
		File file = new File(classLoader.getResource("testpatient.json").getFile());
		JsonNode node = mapper.readTree(file);
		JSONWalker walker = new JSONWalker();
		walker.setMetaRepository(repo);
		structure = walker.fromJSON(node);
	}

	private FhirPathElement parseExpression(String testee) {
		ANTLRInputStream in = new ANTLRInputStream(testee);
		FhirPathLexer lexer = new FhirPathLexer(in);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		FhirPathParser parser = new FhirPathParser(tokens);
		ParseTree tree = parser.expression();
		FhirPathVisitor visitor = new FhirPathVisitor();
		FhirPathElement element = visitor.visit(tree);
		return element;
	}

	@Test
	public void testSimpleNavigation() {
		String testee = "Patient.gender";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertEquals("male", result.asString());
		testee = "gender";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertEquals("male", result.asString());
	}

	@Test
	public void testThreeLevelNavigation() {
		String testee = "Patient.maritalStatus.text";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertEquals("S", result.asString());
	}

	@Test
	public void testCollectionsNavigation() {
		String testee = "Patient.identifier.value";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(result.asStringList().size() == 4);
	}

	@Test
	public void testCollectionsIndexNavigation() {
		String testee = "Patient.identifier[1].value";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(result.asStringList().size() == 1);
		assertEquals("999771759", result.asStringList().get(0));
		testee = "Patient.identifier.value[2]";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(result.asStringList().size() == 1);
		assertEquals("S99965176", result.asStringList().get(0));
	}

	@Test
	public void testUnion() {
		String testee = "Patient.id | Patient.gender";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertEquals(2, result.size());
		testee = "'check' | 'check'";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertEquals(1, result.size());
		// TBD Clarify how to better detect duplicates
		// testee = "Patient.gender | Patient.gender";
		// element = parseExpression(testee);
		// result = element.evaluate(FhirCollectionNode.create(structure));
		// assertEquals(1,result.size());
	}

	@Test
	public void testValueString() {
		String testee = "'S'";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		System.out.println(result);
	}

	@Test
	public void testStringEquals() {
		String testee = "Patient.gender = 'male'";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		System.out.println(result);
		assertTrue(result.asBoolean());
		testee = "Patient.id = 'male'";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertFalse(result.asBoolean());
		testee = "Patient.id = Patient.gender";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertFalse(result.asBoolean());
		testee = "Patient.gender = Patient.gender";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(result.asBoolean());
		testee = "'SomeText' = 'SomeText'";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(result.asBoolean());
	}

	@Test
	public void testValueNumber() {
		String testee = "12";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(12 == result.asInteger());
	}

	@Test
	public void testNumberAddition() {
		String testee = "12+13";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(25 == result.asInteger());
		testee = "Patient.extension.count()+13";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(18 == result.asInteger());
		testee = "2.3+1.6";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(3.9 == result.asDouble());
		testee = "2.3+5";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(7.3 == result.asDouble());
	}

	@Test
	public void testNumberMultiplication() {
		String testee = "2*6";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(12 == result.asInteger());
		testee = "6/2";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(3 == result.asInteger());
		testee = "1.5*2";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(3.0 == result.asDouble());
	}

	@Test
	public void testComparision() {
		String testee = "12>13";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertFalse(result.asBoolean());
		testee = "'12'.toInteger()>11";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(result.asBoolean());
		testee = "12.toInteger()>11";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(result.asBoolean());
	}

	@Test
	public void testStringAddition() {
		String testee = "'Hello'+' World'";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue("Hello World".equals(result.asString()));
		testee = "'hello'+Patient.maritalStatus.text";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue("helloS".equals(result.asString()));
		testee = "'hello'+Patient.name[0].text";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(result.size() == 0);
		testee = "'hello'&Patient.name[0].text";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue("hello".equals(result.asString()));
		testee = "'hello'&(' '+Patient.name[0].text)";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue("hello".equals(result.asString()));
	}

	@Test
	public void testStringManipulation() {
		String testee = "'Hello World'.indexOf('World')";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(6 == result.asInteger());
		testee = "'Hello World'.substring(6)";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue("World".equals(result.asString()));
		testee = "'Hello World'.substring(6,2)";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue("Wo".equals(result.asString()));
		testee = "'Hello World'.substring(6,name.count())";
		element = parseExpression(testee);
		result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue("W".equals(result.asString()));
	}

	@Test
	public void testCount() {
		String testee = "Patient.name.count()";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(FhirCollectionNode.create(structure));
		assertTrue(1 == result.asInteger());
		testee = "Patient.extension.count()";
		element = parseExpression(testee);
		long start = System.currentTimeMillis();
		result = element.evaluate(FhirCollectionNode.create(structure));
		long stop = System.currentTimeMillis();
		System.out.println("Took:" + (stop - start));
		assertTrue(5 == result.asInteger());
	}

	@Test
	public void testMap() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("id", "hallo");
		map.put("firstname", "Peter");
		map.put("lastname", null);
		MapBasedCollectionNode root = MapBasedCollectionNode.create(map);
		root.setType("Patient");
		String testee = "Patient.id";
		FhirPathElement element = parseExpression(testee);
		CollectionNode result = element.evaluate(root);
		assertEquals("hallo", result.asString());
		testee = "Patient.firstname&(' '+Patient.lastname)";
		element = parseExpression(testee);
		result = element.evaluate(root);
		assertEquals("Peter", result.asString());
		map.put("lastname", "Pan");
		testee = "Patient.firstname&(' '+Patient.lastname)";
		element = parseExpression(testee);
		result = element.evaluate(root);
		assertEquals("Peter Pan", result.asString());
		testee = "Patient.firstname='Peter'";
		element = parseExpression(testee);
		result = element.evaluate(root);
		assertEquals(true, result.asBoolean());
		testee = "Patient.firstname='Meier'";
		element = parseExpression(testee);
		result = element.evaluate(root);
		assertEquals(false, result.asBoolean());

	}

	// @Test
	// public void testMultipleUnion() {
	// String testee = "RelatedPerson.address.city | Practitioner.address.city |
	// Person.address.city | Patient.address.city";
	// FhirPathElement element = parseExpression(testee);
	// assertNotNull(element);
	// }
	//
	// @Test
	// public void testAs() {
	// String testee = "FamilyMemberHistory.condition.code |
	// DeviceRequest.code.as(CodeableConcept) | AllergyIntolerance.code |
	// Condition.code";
	// FhirPathElement element = parseExpression(testee);
	// assertNotNull(element);
	// }

}
